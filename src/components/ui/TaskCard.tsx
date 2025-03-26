
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { HomeworkItem, useAppContext } from '@/context/AppContext';
import { getRelativeTimeString } from '@/utils/dateUtils';
import { Clock } from 'lucide-react';

interface TaskCardProps {
  task: HomeworkItem;
  onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const { toggleHomeworkStatus, getClassById } = useAppContext();
  const classItem = getClassById(task.classId);
  const dueTimeString = getRelativeTimeString(task.dueDate);
  const isPastDue = getRelativeTimeString(task.dueDate) === 'Overdue';
  
  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleHomeworkStatus(task.id);
  };

  return (
    <Card 
      className={`glass-card hover-card overflow-hidden ${task.completed ? 'opacity-70' : ''}`}
      onClick={onClick}
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
            <h3 className={`font-semibold text-base ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h3>
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
  );
};

export default TaskCard;
