"use client";
import { useTasks } from "@/context/taskContext";
import useRedirect from "@/hooks/useUserRedirect";
import Filters from "./Components/Filters/Filters";
import TaskItem from "./Components/TaskItem/TaskItem";
import { Task } from "@/utils/types";
import { filteredTasks } from "@/utils/utilities";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { container, item } from "@/utils/animations";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

export default function Home() {
  useRedirect("/login");

  const { tasks, openModalForAdd, priority, setPriority } = useTasks();
  const filtered = filteredTasks(tasks, priority);
  const newTask = filtered.map((task, index) => ({
    ...task,
    id: index, // or any unique identifier logic you need
  }));

  const [completed, setCompleted] = useState(
    newTask.filter((task) => task.completed === true)
  );
  const [inProgress, setInProgress] = useState(
    newTask.filter((task) => task.completed !== true)
  );

  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    setPriority("all");
  }, []);

  useEffect(() => {
    tasks.forEach((task: Task) => {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (!task.completed && dueDate < today) {
        const overdueDays = Math.floor(
          (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        toast(`${task.title} is overdue by ${overdueDays} day(s)`, {
          position: "top-right",
        });
      }
    });
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  const findList = (id: number) =>
    inProgress.some((task) => task.id === id) ? "inProgress" : "completed";

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    const activeList = findList(active.id);
    const overList = findList(over.id);

    if (activeList !== overList) {
      const activeTask =
        activeList === "inProgress"
          ? inProgress.find((task) => task.id === active.id)
          : completed.find((task) => task.id === active.id);

      if (activeTask) {
        if (overList === "inProgress") {
          setInProgress((prev) => [...prev, activeTask]);
          setCompleted((prev) => prev.filter((task) => task.id !== active.id));
        } else {
          setCompleted((prev) => [...prev, activeTask]);
          setInProgress((prev) => prev.filter((task) => task.id !== active.id));
        }
      }
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeList = findList(active.id);
    const overList = findList(over.id);

    if (activeList === overList) {
      const activeIndex =
        activeList === "inProgress"
          ? inProgress.findIndex((task) => task.id === active.id)
          : completed.findIndex((task) => task.id === active.id);

      const overIndex =
        activeList === "inProgress"
          ? inProgress.findIndex((task) => task.id === over.id)
          : completed.findIndex((task) => task.id === over.id);

      if (activeIndex !== overIndex) {
        if (activeList === "inProgress") {
          setInProgress((items) => arrayMove(items, activeIndex, overIndex));
        } else {
          setCompleted((items) => arrayMove(items, activeIndex, overIndex));
        }
      }
    }

    setActiveId(null);
  };

  const { setNodeRef: setFirstDroppableRef } = useDroppable({
    id: "in-progress",
  });

  const { setNodeRef: setsecondDroppableRef } = useDroppable({
    id: "completed",
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <main className="m-6 h-full">
        <ToastContainer />
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">All Tasks</h1>
          <Filters />
        </div>

        <motion.div
          className="pb-[2rem] mt-6 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <div
            className="task-column flex flex-col gap-2 w-[350px]"
            ref={setFirstDroppableRef}
          >
            <h2 className="text-xl font-semibold">In Progress</h2>
            <SortableContext
              id="in-progress"
              items={inProgress}
              strategy={horizontalListSortingStrategy}
            >
              {inProgress.map((task) => (
                <TaskItem key={task.id} id={task.id} task={task} />
              ))}
            </SortableContext>
          </div>

          <div
            className="task-column flex flex-col gap-2 w-[350px]"
            ref={setsecondDroppableRef}
          >
            <h2 className="text-xl font-semibold">Completed</h2>
            <SortableContext
              id="completed"
              items={completed}
              strategy={horizontalListSortingStrategy}
            >
              {completed.map((task) => (
                <TaskItem key={task.id} id={task.id} task={task} />
              ))}
            </SortableContext>
          </div>

          {/* <motion.button
            className="h-[16rem] w-full py-2 rounded-md text-lg font-medium text-gray-500 border-dashed border-2 border-gray-400
          hover:bg-gray-300 hover:border-none transition duration-200 ease-in-out"
            onClick={openModalForAdd}
            variants={item}
          >
            Add New Task
          </motion.button> */}
        </motion.div>
      </main>
    </DndContext>
  );
}
