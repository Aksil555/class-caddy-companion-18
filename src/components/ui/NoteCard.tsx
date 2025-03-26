
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { NoteItem, useAppContext } from '@/context/AppContext';
import { formatShortDate } from '@/utils/dateUtils';

interface NoteCardProps {
  note: NoteItem;
  onClick?: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onClick }) => {
  const { getClassById } = useAppContext();
  const classItem = getClassById(note.classId);
  const updatedDate = formatShortDate(note.updatedAt);
  
  // Truncate content if it's too long
  const truncatedContent = note.content.length > 120 
    ? note.content.substring(0, 120) + '...' 
    : note.content;

  return (
    <Card 
      className="glass-card hover-card overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className={`h-2 bg-subject-${classItem?.subject || 'default'}`} />
      <CardContent className="pt-5 pb-4 px-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-base">{note.title}</h3>
          <span className="text-xs text-muted-foreground">{updatedDate}</span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{classItem?.name || 'Unknown Class'}</p>
        <p className="text-sm line-clamp-3">{truncatedContent}</p>
      </CardContent>
    </Card>
  );
};

export default NoteCard;
