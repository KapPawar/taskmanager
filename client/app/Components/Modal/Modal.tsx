"use client";
import { useTasks } from "@/context/taskContext";
import useDetectOutside from "@/hooks/useDetectOutside";
// import { useUploadThing } from "@/lib/uploadthing";
import React, { useCallback, useEffect, useState } from "react";
import { FileUploader } from "../fileloader/FileLoader";
import { useUploadThing } from "@/lib/uploadthing";
import { useDropzone } from "@uploadthing/react";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";

function Modal() {
  const {
    task,
    handleInput,
    createTask,
    isEditing,
    closeModal,
    modalMode,
    activeTask,
    updateTask,
  } = useTasks();
  const ref = React.useRef(null);
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { startUpload, routeConfig } = useUploadThing("fileUploader");
  // const { startUpload, routeConfig } = useUploadThing("fileUploader", {
  //   onClientUploadComplete: () => {
  //     alert("uploaded successfully!");
  //   },
  //   onUploadError: () => {
  //     alert("error occurred while uploading");
  //   },
  //   onUploadBegin: ({ file }) => {
  //     console.log("upload has begun for", file);
  //   },
  // });

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept(
      generatePermittedFileTypes(routeConfig).fileTypes
    ),
  });

  
  // const { startUpload } = useUploadThing("fileUploader");

  // Use the hook to detect clicks outside the modal
  useDetectOutside({
    ref,
    callback: () => {
      if (isEditing) {
        closeModal(); // Close modal if it is in add/edit mode
      }
    },
  });

  useEffect(() => {
    if (modalMode === "edit" && activeTask) {
      handleInput("setTask")(activeTask);
    }
  }, [modalMode, activeTask]);

  const convertFileToUrl = (file: File) => URL.createObjectURL(file);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      // Convert FileList to an array and update the state
      setFiles((prevFiles) => [...prevFiles, ...Array.from(selectedFiles)]);
      console.log(files);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (modalMode === "edit") {
      updateTask(task);
    } else if (modalMode === "add") {
      if (files.length > 0) {
        // console.log(files)
        const uploadedFiles = await startUpload(files);
        if (!uploadedFiles) {
          return;
        }
        task.fileUrl = uploadedFiles[0].url;
        task.fileName = uploadedFiles[0].name;
      }
      console.log(task);
      createTask(task);
    }
    closeModal();
  };

  return (
    <div className="fixed left-0 top-0 z-50 h-full w-full bg-[#333]/30 overflow-hidden">
      <form
        action=""
        className="py-5 px-6 max-w-[520px] w-full flex flex-col gap-3 bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg shadow-md"
        onSubmit={handleSubmit}
        ref={ref}
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="title">Title</label>
          <input
            className="bg-[#F9F9F9] p-2 rounded-md border"
            type="text"
            id="title"
            placeholder="Task Title"
            name="title"
            value={task.title}
            onChange={(e) => handleInput("title")(e)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="description">Description</label>
          <textarea
            className="bg-[#F9F9F9] p-2 rounded-md border resize-none"
            id="desc"
            name="description"
            placeholder="Task Description"
            rows={4}
            value={task.description}
            onChange={(e) => handleInput("description")(e)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="priority">Select Priority</label>
          <select
            className="bg-[#F9F9F9] p-2 rounded-md border cursor-pointer"
            id="priority"
            name="priority"
            value={task.priority}
            onChange={(e) => handleInput("priority")(e)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="dueDate">Due Date</label>
          <input
            className="bg-[#F9F9F9] p-2 rounded-md border"
            id="date"
            type="date"
            name="dueDate"
            value={task.dueDate ? task.dueDate.split("T")[0] : ""}
            onChange={(e) => handleInput("dueDate")(e)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="completed">Task Completed</label>
          <div className="flex items-center justify-between bg-[#F9F9F9] p-2 rounded-md border">
            <label htmlFor="completed">Completed</label>
            <div>
              <select
                className="bg-[#f9f9f9] p-2 rounded-md border cursor-pointer"
                id="completed"
                name="completed"
                value={task.completed ? "true" : "false"}
                onChange={(e) => handleInput("completed")(e)}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
          </div>
        </div>

        {modalMode === "add" && (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div>
              {files.length > 0 && (
                <button id="fileUpload" onClick={() => startUpload(files)}>
                  Upload {files.length} files
                </button>
              )}
            </div>
            Drop files here!
          </div>
        )}

        {modalMode === "edit" && (
          <a
            href={task.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 text-blue-500"
          >
            {task.fileName}
          </a>
        )}

<div className="mt-8 flex gap-3">
          <button
            type="submit"
            id="create"
            className={`text-white py-2 rounded-md w-full hover:bg-[#7263F3] transition duration-200 ease-in-out ${
              modalMode === "edit" ? "bg-[#0064b1]" : "bg-[#0064b1]"
            }`}
          >
            {modalMode === "edit" ? "Update Task" : "Create Task"}
          </button>

          <button
            className={`text-white py-2 rounded-md w-full hover:bg-[#7263F3] transition duration-200 ease-in-out ${
              modalMode === "edit" ? "bg-[#0064b1]" : "bg-[#0064b1]"
            }`}
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
}

export default Modal;
