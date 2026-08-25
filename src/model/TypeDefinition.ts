export interface Msg {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
}

export interface User {
  id: number;
  username: string;
  gender: number;
  phone: string;
  avatar: string;
  email: string;
}

export interface ChatRecord {
  user: User;
  msgList: Msg[];
}

export interface Video {
  id: number;
  source_url: string;
  cover_url: string;
  play_count: number;
  play_time: number;
  title: string;
  tags: string;
  uid: number;
  video_desc: string;
  createTime: string;
  updateTime: string;
}

export interface NamedVideo {
  video: Video;
  username: string;
}

export interface VideoComment {
  id: number;
  uid: number;
  video_id: number;
  parent_id: number;
  reply_to_uid: number;
  content: string;
  username: string;
  avatar: string;
  create_time: string;
}

export interface VideoCommentResponse {
  comment: VideoComment;
  childComments: VideoComment[];
}

export interface SendDanmuRequest {
  id: number;
  author: string;
  time: number;
  text: string;
  color: number;
  type: number;
}
