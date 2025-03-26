
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import ClassCard from '@/components/ui/ClassCard';
import TaskCard from '@/components/ui/TaskCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlusCircle, Plus } from 'lucide-react';
import { getDayName, formatDate } from '@/utils/dateUtils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
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

const Index = () => {
  const { getTodayClasses, getPendingHomework, classes, addClass, addHomework } = useAppContext();
  const navigate = useNavigate();
  const todayClasses = getTodayClasses();
  const pendingHomework = getPendingHomework().slice(0, 3); // Show only 3 tasks
  const today = new Date();
  const dayName = getDayName(today.getDay());

  // State for add class dialog
  const [showAddClassDialog, setShowAddClassDialog] = useState(false);
  const [newClass, setNewClass] = useState({
    name: '',
    subject: 'default' as const,
    instructor: '',
    room: '',
    dayOfWeek: today.getDay(),
    startTime: '09:00',
    endTime: '10:30',
  });

  // State for add task dialog
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [newHomework, setNewHomework] = useState({
    title: '',
    description: '',
    classId: classes.length > 0 ? classes[0].id : '',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    completed: false,
  });

  const handleClassInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewClass({ ...newClass, [name]: value });
  };

  const handleTaskInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewHomework({ ...newHomework, [name]: value });
  };

  const handleAddClass = () => {
    if (!newClass.name || !newClass.instructor || !newClass.room) {
      toast.error('Please fill in all required fields');
      return;
    }

    addClass(newClass);
    setShowAddClassDialog(false);
    setNewClass({
      name: '',
      subject: 'default' as const,
      instructor: '',
      room: '',
      dayOfWeek: today.getDay(),
      startTime: '09:00',
      endTime: '10:30',
    });
    toast.success('Class added successfully');
  };

  const handleAddHomework = () => {
    if (!newHomework.title || !newHomework.classId || !newHomework.dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    addHomework({
      ...newHomework,
      dueDate: new Date(`${newHomework.dueDate}T23:59:59`).toISOString(),
    });
    setShowAddTaskDialog(false);
    setNewHomework({
      title: '',
      description: '',
      classId: classes.length > 0 ? classes[0].id : '',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      completed: false,
    });
    toast.success('Homework added successfully');
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Welcome Back!</h1>
        <p className="page-description">Here's your schedule for {dayName}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Today's Classes</h2>
            <Button variant="outline" size="sm" onClick={() => setShowAddClassDialog(true)}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Class
            </Button>
          </div>

          {todayClasses.length > 0 ? (
            <div className="space-y-4">
              {todayClasses.map((classItem) => (
                <ClassCard key={classItem.id} classItem={classItem} onClick={() => navigate('/schedule')} />
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center text-muted-foreground">
              <p>No classes scheduled for today</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setShowAddClassDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Class
              </Button>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Upcoming Homework</h2>
            <Button variant="outline" size="sm" onClick={() => setShowAddTaskDialog(true)}>
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>

          {pendingHomework.length > 0 ? (
            <div className="space-y-4">
              {pendingHomework.map((task) => (
                <TaskCard key={task.id} task={task} onClick={() => navigate('/homework')} />
              ))}
              {pendingHomework.length < getPendingHomework().length && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/homework')}
                >
                  View All ({getPendingHomework().length}) Tasks
                </Button>
              )}
            </div>
          ) : (
            <Card className="p-6 text-center text-muted-foreground">
              <p>No pending homework</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setShowAddTaskDialog(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Task
              </Button>
            </Card>
          )}
        </div>
      </div>

      {/* Add Class Dialog */}
      <AlertDialog open={showAddClassDialog} onOpenChange={setShowAddClassDialog}>
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Class</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the details for your new class
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Class Name
              </Label>
              <Input
                id="name"
                name="name"
                value={newClass.name}
                onChange={handleClassInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subject
              </Label>
              <select
                id="subject"
                name="subject"
                value={newClass.subject}
                onChange={handleClassInputChange}
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
              <Label htmlFor="instructor" className="text-right">
                Instructor
              </Label>
              <Input
                id="instructor"
                name="instructor"
                value={newClass.instructor}
                onChange={handleClassInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room" className="text-right">
                Room
              </Label>
              <Input
                id="room"
                name="room"
                value={newClass.room}
                onChange={handleClassInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Start Time
              </Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={newClass.startTime}
                onChange={handleClassInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right">
                End Time
              </Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={newClass.endTime}
                onChange={handleClassInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddClass}>Add Class</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Task Dialog */}
      <AlertDialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
        <AlertDialogContent className="sm:max-w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Add New Homework</AlertDialogTitle>
            <AlertDialogDescription>
              Enter the details for your new assignment
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
                value={newHomework.title}
                onChange={handleTaskInputChange}
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
                value={newHomework.classId}
                onChange={handleTaskInputChange}
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
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <textarea
                id="description"
                name="description"
                value={newHomework.description}
                onChange={handleTaskInputChange}
                className="col-span-3 min-h-[100px] flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                value={newHomework.dueDate}
                onChange={handleTaskInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddHomework}>Add Homework</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
