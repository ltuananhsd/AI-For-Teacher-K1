import { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

const ACCEPTED = '.pdf,.docx,.txt,.xlsx,.xls,.md';

const STATUS_LABELS = {
    processing: 'Đang xử lý...',
    done: 'Hoàn tất!',
    error: 'Lỗi',
};

export default function FileUploadZone({ onUploadComplete }) {
    const [dragging, setDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [taskId, setTaskId] = useState(null);
    const [taskStatus, setTaskStatus] = useState(null);
    const inputRef = useRef();
    const pollRef = useRef(null);

    function clearState() {
        setUploadProgress(0);
        setUploading(false);
        setTaskId(null);
        setTaskStatus(null);
        if (pollRef.current) clearInterval(pollRef.current);
    }

    function startPolling(id) {
        pollRef.current = setInterval(async () => {
            try {
                const res = await fetch(`/api/v1/rag/upload/${id}/status`);
                const data = await res.json();
                setTaskStatus(data);
                if (data.status === 'done') {
                    clearInterval(pollRef.current);
                    onUploadComplete();
                    setTimeout(clearState, 3000);
                } else if (data.status === 'error') {
                    clearInterval(pollRef.current);
                    setTimeout(clearState, 5000);
                }
            } catch {
                clearInterval(pollRef.current);
            }
        }, 2000);
    }

    async function uploadFile(file) {
        clearState();
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.upload.addEventListener('progress', e => {
                if (e.lengthComputable) {
                    setUploadProgress(Math.round((e.loaded / e.total) * 100));
                }
            });
            xhr.addEventListener('load', async () => {
                if (xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText);
                    setTaskId(data.task_id);
                    setTaskStatus({ status: 'processing', filename: file.name });
                    startPolling(data.task_id);
                    resolve();
                } else {
                    setTaskStatus({ status: 'error', error: xhr.responseText });
                    setTimeout(clearState, 5000);
                    reject();
                }
                setUploading(false);
            });
            xhr.addEventListener('error', () => {
                setTaskStatus({ status: 'error', error: 'Upload thất bại' });
                setUploading(false);
                setTimeout(clearState, 5000);
                reject();
            });
            xhr.open('POST', '/api/v1/rag/upload');
            xhr.send(formData);
        }).catch(() => {});
    }

    function handleDrop(e) {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) uploadFile(file);
    }

    function handleSelect(e) {
        const file = e.target.files[0];
        if (file) uploadFile(file);
        e.target.value = '';
    }

    const isProcessing = uploading || (taskStatus && taskStatus.status === 'processing');

    return (
        <div>
            <div
                onDragEnter={() => setDragging(true)}
                onDragLeave={() => setDragging(false)}
                onDragOver={e => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => !isProcessing && inputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors text-center
                    ${dragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-200 bg-gray-50 hover:border-indigo-300'}
                    ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
            >
                <Upload size={28} className={`${dragging ? 'text-indigo-500' : 'text-gray-400'}`} />
                <p className="text-sm font-medium text-gray-700">
                    {dragging ? 'Thả file vào đây' : 'Kéo thả file hoặc click để chọn'}
                </p>
                <p className="text-xs text-gray-400">PDF, DOCX, TXT, XLSX, MD — tối đa 50MB</p>
                <input ref={inputRef} type="file" accept={ACCEPTED} className="hidden" onChange={handleSelect} />
            </div>

            {/* Upload progress */}
            {uploading && (
                <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Đang tải lên...</span>
                        <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-500 transition-all rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Task status */}
            {taskStatus && !uploading && (
                <div className={`mt-3 flex items-center gap-2 text-sm px-3 py-2 rounded-xl ${
                    taskStatus.status === 'done' ? 'bg-green-50 text-green-700' :
                    taskStatus.status === 'error' ? 'bg-red-50 text-red-600' :
                    'bg-indigo-50 text-indigo-700'
                }`}>
                    {taskStatus.status === 'done' && <CheckCircle size={16} />}
                    {taskStatus.status === 'error' && <AlertCircle size={16} />}
                    {taskStatus.status === 'processing' && (
                        <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    )}
                    <span>
                        {STATUS_LABELS[taskStatus.status] || taskStatus.status}
                        {taskStatus.status === 'error' && taskStatus.error ? `: ${taskStatus.error}` : ''}
                        {taskStatus.filename ? ` — ${taskStatus.filename}` : ''}
                    </span>
                </div>
            )}
        </div>
    );
}
