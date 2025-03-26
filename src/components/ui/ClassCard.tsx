
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ClassItem, useAppContext } from '@/context/AppContext';
import { Clock, Edit, Trash2, MoreVertical, MapPin } from 'lucide-react';
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
import { getDayName } from '@/utils/dateUtils';

interface ClassCardProps {
  classItem: ClassItem;
  showActions?: boolean;
  onClick?: () => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ classItem, showActions = false, onClick }) => {
  const { updateClass, deleteClass } = useAppContext();
  
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editedClass, setEditedClass] = useState({
    name: classItem.name,
    subject: classItem.subject,
    instructor: classItem.instructor,
    room: classItem.room,
    dayOfWeek: classItem.dayOfWeek,
    startTime: classItem.startTime,
    endTime: classItem.endTime,
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedClass({ ...editedClass, [name]: value });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditedClass({
      name: classItem.name,
      subject: classItem.subject,
      instructor: classItem.instructor,
      room: classItem.room,
      dayOfWeek: classItem.dayOfWeek,
      startTime: classItem.startTime,
      endTime: classItem.endTime,
    });
    setShowEditDialog(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const confirmEdit = () => {
    if (!editedClass.name || !editedClass.instructor || !editedClass.room) {
      toast.error('Please fill in all required fields');
      return;
    }

    updateClass(classItem.id, editedClass);
    setShowEditDialog(false);
    toast.success('Class updated successfully');
  };

  const confirmDelete = () => {
    deleteClass(classItem.id);
    setShowDeleteDialog(false);
    toast.success('Class deleted successfully');
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick) onClick();
  };

  const daysOfWeek = [0, 1, 2, 3, 4, 5, 6]; // 0 is Sunday, 6 is Saturday

  return (
    <>
      <Card 
        className={`glass-card hover-card overflow-hidden relative`}
        onClick={handleCardClick}
      >
        <div className={`h-2 bg-subject-${classItem.subject}`} />
        <CardContent className="pt-5 pb-4 px-5">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-base">
              {classItem.name}
            </h3>
            {showActions && (
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
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mt-1 mb-3">
            {classItem.instructor}
          </p>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {classItem.startTime} - {classItem.endTime}
              </span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Room {classItem.room}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <AlertDialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Class</AlertDialogTitle>
            <AlertDialogDescription>
              Update the details of your class
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Class Name
              </Label>
              <Input
                id="edit-name"
                name="name"
                value={editedClass.name}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-subject" className="text-right">
                Subject
              </Label>
              <select
                id="edit-subject"
                name="subject"
                value={editedClass.subject}
                onChange={handleInputChange}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="math">Math</option>
                <option value="science">Science</option>
                <option value="history">History</option>
                <option value="english">English</option>
                <option value="art">Art</option>
                <option value="music">Music</option>
                <option value="pe">Physical Education</option>
                <option value="languages">Languages</option>
                <option value="cs">Computer Science</option>
                <option value="default">Other</option>
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-instructor" className="text-right">
                Instructor
              </Label>
              <Input
                id="edit-instructor"
                name="instructor"
                value={editedClass.instructor}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-room" className="text-right">
                Room
              </Label>
              <Input
                id="edit-room"
                name="room"
                value={editedClass.room}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-dayOfWeek" className="text-right">
                Day
              </Label>
              <select
                id="edit-dayOfWeek"
                name="dayOfWeek"
                value={editedClass.dayOfWeek}
                onChange={handleInputChange}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {daysOfWeek.map((day) => (
                  <option key={day} value={day}>
                    {getDayName(day)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-startTime" className="text-right">
                Start Time
              </Label>
              <Input
                id="edit-startTime"
                name="startTime"
                type="time"
                value={editedClass.startTime}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-endTime" className="text-right">
                End Time
              </Label>
              <Input
                id="edit-endTime"
                name="endTime"
                type="time"
                value={editedClass.endTime}
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
            <AlertDialogTitle>Delete Class</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this class? This will also delete all homework and notes associated with this class. This action cannot be undone.
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

export default ClassCard;
