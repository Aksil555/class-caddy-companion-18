
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Subject = 'math' | 'science' | 'history' | 'english' | 'art' | 'music' | 'pe' | 'languages' | 'cs' | 'default';

export interface ClassItem {
  id: string;
  name: string;
  subject: Subject;
  instructor: string;
  room: string;
  dayOfWeek: number; // 0-6, where 0 is Sunday
  startTime: string; // Format: "HH:MM"
  endTime: string; // Format: "HH:MM"
}

export interface HomeworkItem {
  id: string;
  classId: string;
  title: string;
  description: string;
  dueDate: string; // ISO string
  completed: boolean;
  createdAt: string; // ISO string
}

export interface NoteItem {
  id: string;
  classId: string;
  title: string;
  content: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

interface AppContextType {
  classes: ClassItem[];
  homework: HomeworkItem[];
  notes: NoteItem[];
  addClass: (classItem: Omit<ClassItem, 'id'>) => void;
  updateClass: (id: string, classItem: Partial<ClassItem>) => void;
  deleteClass: (id: string) => void;
  addHomework: (homework: Omit<HomeworkItem, 'id' | 'createdAt'>) => void;
  updateHomework: (id: string, homework: Partial<HomeworkItem>) => void;
  deleteHomework: (id: string) => void;
  toggleHomeworkStatus: (id: string) => void;
  addNote: (note: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<NoteItem>) => void;
  deleteNote: (id: string) => void;
  getClassById: (id: string) => ClassItem | undefined;
  getHomeworkByClass: (classId: string) => HomeworkItem[];
  getNotesByClass: (classId: string) => NoteItem[];
  getTodayClasses: () => ClassItem[];
  getPendingHomework: () => HomeworkItem[];
}

// Sample data
const initialClasses: ClassItem[] = [
  {
    id: '1',
    name: 'Calculus',
    subject: 'math',
    instructor: 'Dr. Smith',
    room: 'M101',
    dayOfWeek: new Date().getDay(),
    startTime: '09:00',
    endTime: '10:30',
  },
  {
    id: '2',
    name: 'Biology',
    subject: 'science',
    instructor: 'Prof. Johnson',
    room: 'S202',
    dayOfWeek: new Date().getDay(),
    startTime: '11:00',
    endTime: '12:30',
  },
  {
    id: '3',
    name: 'World History',
    subject: 'history',
    instructor: 'Dr. Williams',
    room: 'H305',
    dayOfWeek: (new Date().getDay() + 1) % 7,
    startTime: '14:00',
    endTime: '15:30',
  },
];

const initialHomework: HomeworkItem[] = [
  {
    id: '1',
    classId: '1',
    title: 'Calculus Assignment 3',
    description: 'Complete problems 15-30 on page 157',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    classId: '2',
    title: 'Biology Lab Report',
    description: 'Write up the results from the cell division experiment',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

const initialNotes: NoteItem[] = [
  {
    id: '1',
    classId: '1',
    title: 'Derivatives',
    content: 'A derivative measures the sensitivity to change of a function...',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [classes, setClasses] = useState<ClassItem[]>(() => {
    const saved = localStorage.getItem('studentClasses');
    return saved ? JSON.parse(saved) : initialClasses;
  });
  
  const [homework, setHomework] = useState<HomeworkItem[]>(() => {
    const saved = localStorage.getItem('studentHomework');
    return saved ? JSON.parse(saved) : initialHomework;
  });
  
  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const saved = localStorage.getItem('studentNotes');
    return saved ? JSON.parse(saved) : initialNotes;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('studentClasses', JSON.stringify(classes));
    localStorage.setItem('studentHomework', JSON.stringify(homework));
    localStorage.setItem('studentNotes', JSON.stringify(notes));
  }, [classes, homework, notes]);

  const addClass = (classItem: Omit<ClassItem, 'id'>) => {
    const newClass = {
      ...classItem,
      id: crypto.randomUUID(),
    };
    setClasses([...classes, newClass]);
  };

  const updateClass = (id: string, classItem: Partial<ClassItem>) => {
    setClasses(
      classes.map((c) => (c.id === id ? { ...c, ...classItem } : c))
    );
  };

  const deleteClass = (id: string) => {
    setClasses(classes.filter((c) => c.id !== id));
    // Also delete associated homework and notes
    setHomework(homework.filter((hw) => hw.classId !== id));
    setNotes(notes.filter((note) => note.classId !== id));
  };

  const addHomework = (homeworkItem: Omit<HomeworkItem, 'id' | 'createdAt'>) => {
    const newHomework = {
      ...homeworkItem,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setHomework([...homework, newHomework]);
  };

  const updateHomework = (id: string, homeworkItem: Partial<HomeworkItem>) => {
    setHomework(
      homework.map((hw) => (hw.id === id ? { ...hw, ...homeworkItem } : hw))
    );
  };

  const deleteHomework = (id: string) => {
    setHomework(homework.filter((hw) => hw.id !== id));
  };

  const toggleHomeworkStatus = (id: string) => {
    setHomework(
      homework.map((hw) =>
        hw.id === id ? { ...hw, completed: !hw.completed } : hw
      )
    );
  };

  const addNote = (noteItem: Omit<NoteItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newNote = {
      ...noteItem,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    setNotes([...notes, newNote]);
  };

  const updateNote = (id: string, noteItem: Partial<NoteItem>) => {
    setNotes(
      notes.map((note) =>
        note.id === id
          ? { ...note, ...noteItem, updatedAt: new Date().toISOString() }
          : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const getClassById = (id: string) => {
    return classes.find((c) => c.id === id);
  };

  const getHomeworkByClass = (classId: string) => {
    return homework.filter((hw) => hw.classId === classId);
  };

  const getNotesByClass = (classId: string) => {
    return notes.filter((note) => note.classId === classId);
  };

  const getTodayClasses = () => {
    const today = new Date().getDay();
    return classes
      .filter((c) => c.dayOfWeek === today)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getPendingHomework = () => {
    return homework
      .filter((hw) => !hw.completed)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  return (
    <AppContext.Provider
      value={{
        classes,
        homework,
        notes,
        addClass,
        updateClass,
        deleteClass,
        addHomework,
        updateHomework,
        deleteHomework,
        toggleHomeworkStatus,
        addNote,
        updateNote,
        deleteNote,
        getClassById,
        getHomeworkByClass,
        getNotesByClass,
        getTodayClasses,
        getPendingHomework,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
