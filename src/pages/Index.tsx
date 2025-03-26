
import React from 'react';
import { useAppContext } from '@/context/AppContext';
import ClassCard from '@/components/ui/ClassCard';
import TaskCard from '@/components/ui/TaskCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { getDayName } from '@/utils/dateUtils';

const Index = () => {
  const { getTodayClasses, getPendingHomework } = useAppContext();
  const todayClasses = getTodayClasses();
  const pendingHomework = getPendingHomework().slice(0, 3); // Show only 3 tasks
  const today = new Date();
  const dayName = getDayName(today.getDay());

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
            <Button variant="outline" size="sm">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Class
            </Button>
          </div>

          {todayClasses.length > 0 ? (
            <div className="space-y-4">
              {todayClasses.map((classItem) => (
                <ClassCard key={classItem.id} classItem={classItem} />
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center text-muted-foreground">
              <p>No classes scheduled for today</p>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Upcoming Homework</h2>
            <Button variant="outline" size="sm">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>

          {pendingHomework.length > 0 ? (
            <div className="space-y-4">
              {pendingHomework.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center text-muted-foreground">
              <p>No pending homework</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
