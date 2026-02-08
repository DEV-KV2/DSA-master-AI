
export enum Sender {
  USER = 'user',
  AI = 'ai'
}

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  timestamp: number;
}

export interface DSATopic {
  id: string;
  title: string;
  description: string;
  icon: string;
}
