import { ObjectId } from 'mongoose';

// Models
export type IMember = {
  discordId: string;
  inviteCode: string;
  inviteUses: number;
  inviteValidUses: number;
  invitedMembers: ObjectId[];
  completeAt?: Date;
};

export type IMemberDb = Document &
  IMember & {
    id: ObjectId;
  };

// Misc

export type EmbedContent = {
  title: string;
  fields: string[][];
};
