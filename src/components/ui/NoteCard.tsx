
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { NoteItem, useAppContext } from '@/context/AppContext';
import { formatShortDate } from '@/utils/dateUtils';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
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

interface NoteCardProps {
  note: NoteItem;
  onClick?: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onClick }) => {
  const { getClassById, updateNote, deleteNote, classes } = useAppContext();
  const classItem = getClassById(note.classId);
  const updatedDate = formatShortDate(note.updatedAt);
  
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editedNote, setEditedNote] = useState({
    title: note.title,
    content: note.content,
    classId: note.classId
  });
  
  // Truncate content if it's too long
  const truncatedContent = note.content.length > 120 
    ? note.content.substring(0, 120) + '...' 
    : note.content;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedNote({ ...editedNote, [name]: value });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditedNote({
      title: note.title,
      content: note.content,
      classId: note.classId
    });
    setShowEditDialog(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const confirmEdit = () => {
    if (!editedNote.title || !editedNote.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    updateNote(note.id, editedNote);
    setShowEditDialog(false);
    toast.success('Note updated successfully');
  };

  const confirmDelete = () => {
    deleteNote(note.id);
    setShowDeleteDialog(false);
    toast.success('Note deleted successfully');
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick) onClick();
  };

  return (
    <>
      <Card 
        className="glass-card hover-card overflow-hidden cursor-pointer relative"
        onClick={handleCardClick}
      >
        <div className={`h-2 bg-subject-${classItem?.subject || 'default'}`} />
        <CardContent className="pt-5 pb-4 px-5">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-base">{note.title}</h3>
            <div className="flex items-center">
              <span className="text-xs text-muted-foreground mr-2">{updatedDate}</span>
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
          </div>
          <p className="text-sm text-muted-foreground mb-3">{classItem?.name || 'Unknown Class'}</p>
          <p className="text-sm line-clamp-3">{truncatedContent}</p>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <AlertDialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Note</AlertDialogTitle>
            <AlertDialogDescription>
              Update the details of your note
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
                value={editedNote.title}
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
                value={editedNote.classId}
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
              <Label htmlFor="edit-content" className="text-right align-top pt-2">
                Content
              </Label>
              <textarea
                id="edit-content"
                name="content"
                value={editedNote.content}
                onChange={handleInputChange}
                className="col-span-3 min-h-[150px] flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
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

export default NoteCard;
