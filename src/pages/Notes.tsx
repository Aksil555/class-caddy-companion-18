
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import NoteCard from '@/components/ui/NoteCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
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

const Notes: React.FC = () => {
  const { notes, classes, addNote } = useAppContext();
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    classId: classes.length > 0 ? classes[0].id : '',
  });

  const filteredNotes = notes
    .filter((note) => selectedClass === 'all' || note.classId === selectedClass)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewNote({ ...newNote, [name]: value });
  };

  const handleAddNote = () => {
    if (!newNote.title || !newNote.classId || !newNote.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    addNote(newNote);
    setShowAddDialog(false);
    setNewNote({
      title: '',
      content: '',
      classId: classes.length > 0 ? classes[0].id : '',
    });
    toast.success('Note added successfully');
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Notes</h1>
        <p className="page-description">Keep track of important information</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <Button
            variant={selectedClass === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedClass('all')}
            size="sm"
          >
            All Classes
          </Button>
          {classes.map((classItem) => (
            <Button
              key={classItem.id}
              variant={selectedClass === classItem.id ? 'default' : 'outline'}
              onClick={() => setSelectedClass(classItem.id)}
              size="sm"
            >
              {classItem.name}
            </Button>
          ))}
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Note
        </Button>
      </div>

      {filteredNotes.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center text-muted-foreground">
          <p>No notes found</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Note
          </Button>
        </Card>
      )}

      <AlertDialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Note</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the details for your new note
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={newNote.title}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="classId" className="text-right">
                Class
              </Label>
              <select
                id="classId"
                name="classId"
                value={newNote.classId}
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
              <Label htmlFor="content" className="text-right align-top pt-2">
                Content
              </Label>
              <textarea
                id="content"
                name="content"
                value={newNote.content}
                onChange={handleInputChange}
                className="col-span-3 min-h-[150px] flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddNote}>Add Note</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Notes;
