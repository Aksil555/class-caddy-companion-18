
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { HomeworkItem, useAppContext } from '@/context/AppContext';
import { getRelativeTimeString } from '@/utils/dateUtils';
import { Clock, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TaskCardProps {
  task: HomeworkItem;
  onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const { toggleHomeworkStatus, getClassById, updateHomework, deleteHomework, classes } = useAppContext();
  const classItem = getClassById(task.classId);
  const dueTimeString = getRelativeTimeString(task.dueDate);
  const isPastDue = getRelativeTimeString(task.dueDate) === 'Overdue';
  
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
    classId: task.classId,
    dueDate: new Date(task.dueDate).toISOString().split('T')[0],
    completed: task.completed
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleHomeworkStatus(task.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditedTask({
      title: task.title,
      description: task.description,
      classId: task.classId,
      dueDate: new Date(task.dueDate).toISOString().split('T')[0],
      completed: task.completed
    });
    setShowEditDialog(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const confirmEdit = () => {
    if (!editedTask.title || !editedTask.classId || !editedTask.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    updateHomework(task.id, {
      ...editedTask,
      dueDate: new Date(`${editedTask.dueDate}T23:59:59`).toISOString(),
    });
    setShowEditDialog(false);
    toast.success('Task updated successfully');
  };

  const confirmDelete = () => {
    deleteHomework(task.id);
    setShowDeleteDialog(false);
    toast.success('Task deleted successfully');
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick) onClick();
  };

  return (
    <>
      <Card 
        className={`glass-card hover-card overflow-hidden relative ${task.completed ? 'opacity-70' : ''}`}
        onClick={handleCardClick}
      >
        <div className={`h-2 bg-subject-${classItem?.subject || 'default'}`} />
        <CardContent className="pt-5 pb-4 px-5">
          <div className="flex">
            <div 
              className="mr-3 mt-1" 
              onClick={handleCheckboxClick}
            >
              <Checkbox 
                checked={task.completed} 
              />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <h3 className={`font-semibold text-base ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {task.title}
                </h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleEdit}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-sm text-muted-foreground mt-1 mb-3">
                {classItem?.name || 'Unknown Class'}
              </p>
              <div className="flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
                <span className={`text-xs ${isPastDue && !task.completed ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                  Due {dueTimeString}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <AlertDialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Task</AlertDialogTitle>
            <AlertDialogDescription>
              Update the details of your task
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-title" className="text-right">
                Title
              </Label>
              <Input
                id="edit-title"
                name="title"
                value={editedTask.title}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-classId" className="text-right">
                Class
              </Label>
              <select
                id="edit-classId"
                name="classId"
                value={editedTask.classId}
                onChange={handleInputChange}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {classes.length > 0 ? (
                  classes.map((classItem) => (
                    <option key={classItem.id} value={classItem.id}>
                      {classItem.name}
                    </option>
                  ))
                ) : (
                  <option value="">No classes available</option>
                )}
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <textarea
                id="edit-description"
                name="description"
                value={editedTask.description}
                onChange={handleInputChange}
                className="col-span-3 min-h-[100px] flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="edit-dueDate"
                name="dueDate"
                type="date"
                value={editedTask.dueDate}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmEdit}>Save Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskCard;
