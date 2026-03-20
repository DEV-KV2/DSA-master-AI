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

export interface ChatResponse {
  text: string;
  sources?: Array<{
    title: string;
    uri: string;
  }>;
}

export interface DSATopic {
  id: string;
  title: string;
  description: string;
  icon: string;
}
