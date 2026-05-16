import FileUpload from "@/app/components/FileUpload";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-center py-16 px-8">
        <h1 className="text-2xl font-bold mb-2 text-black dark:text-white">
          大文件分片上传
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          支持断点续传 · 分片并发上传 · MD5 秒传
        </p>
        <FileUpload />
      </main>
    </div>
  );
}
