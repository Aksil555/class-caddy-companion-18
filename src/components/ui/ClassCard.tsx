
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin } from 'lucide-react';
import { ClassItem } from '@/context/AppContext';
import { formatTime } from '@/utils/dateUtils';

interface ClassCardProps {
  classItem: ClassItem;
  onClick?: () => void;
  showActions?: boolean;
}

const ClassCard: React.FC<ClassCardProps> = ({ 
  classItem, 
  onClick, 
  showActions = false 
}) => {
  const subjectColor = `bg-subject-${classItem.subject}`;
  const startTimeFormatted = formatTime(classItem.startTime);
  const endTimeFormatted = formatTime(classItem.endTime);

  return (
    <Card 
      className="glass-card hover-card overflow-hidden"
      onClick={onClick}
    >
      <div className={`h-2 ${subjectColor}`} />
      <CardContent className="pt-6 pb-4 px-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg">{classItem.name}</h3>
            <p className="text-sm text-muted-foreground">{classItem.instructor}</p>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>{startTimeFormatted} - {endTimeFormatted}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
            <span>Room {classItem.room}</span>
          </div>
        </div>
        
        {showActions && (
          <div className="mt-5 flex justify-end space-x-2">
            <Button variant="outline" size="sm">Add Homework</Button>
            <Button variant="outline" size="sm">Add Note</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClassCard;
