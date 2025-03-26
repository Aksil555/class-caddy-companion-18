
import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import ClassCard from '@/components/ui/ClassCard';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getDayName, getShortDayName } from '@/utils/dateUtils';
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

const Schedule: React.FC = () => {
  const { classes, addClass } = useAppContext();
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDay());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newClass, setNewClass] = useState({
    name: '',
    subject: 'default' as const,
    instructor: '',
    room: '',
    dayOfWeek: selectedDay,
    startTime: '09:00',
    endTime: '10:30',
  });

  const classesForDay = classes
    .filter((c) => c.dayOfWeek === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewClass({ ...newClass, [name]: value });
  };

  const handleAddClass = () => {
    if (!newClass.name || !newClass.instructor || !newClass.room) {
      toast.error('Please fill in all required fields');
      return;
    }

    addClass(newClass);
    setShowAddDialog(false);
    setNewClass({
      name: '',
      subject: 'default' as const,
      instructor: '',
      room: '',
      dayOfWeek: selectedDay,
      startTime: '09:00',
      endTime: '10:30',
    });
    toast.success('Class added successfully');
  };

  const daysOfWeek = [0, 1, 2, 3, 4, 5, 6]; // 0 is Sunday, 6 is Saturday

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Weekly Schedule</h1>
        <p className="page-description">Manage your class schedule</p>
      </div>

      <div className="flex overflow-x-auto pb-4 mb-6">
        {daysOfWeek.map((day) => (
          <button
            key={day}
            className={`px-4 py-3 min-w-[100px] text-center rounded-lg mr-2 transition-colors ${
              selectedDay === day
                ? 'bg-primary text-primary-foreground font-medium'
                : 'bg-card hover:bg-accent'
            }`}
            onClick={() => setSelectedDay(day)}
          >
            <div className="font-medium">{getShortDayName(day)}</div>
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{getDayName(selectedDay)}</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Class
        </Button>
      </div>

      {classesForDay.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {classesForDay.map((classItem) => (
            <ClassCard key={classItem.id} classItem={classItem} showActions={true} />
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center text-muted-foreground">
          <p>No classes scheduled for {getDayName(selectedDay)}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setShowAddDialog(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Class
          </Button>
        </Card>
      )}

      <AlertDialog open={showAddDialog} onOpenChange={setShowAddDialog}>
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
                onChange={handleInputChange}
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
              <Label htmlFor="instructor" className="text-right">
                Instructor
              </Label>
              <Input
                id="instructor"
                name="instructor"
                value={newClass.instructor}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dayOfWeek" className="text-right">
                Day
              </Label>
              <select
                id="dayOfWeek"
                name="dayOfWeek"
                value={newClass.dayOfWeek}
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
              <Label htmlFor="startTime" className="text-right">
                Start Time
              </Label>
              <Input
                id="startTime"
                name="startTime"
                type="time"
                value={newClass.startTime}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
    </div>
  );
};

export default Schedule;
