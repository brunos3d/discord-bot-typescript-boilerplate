import { model, Schema } from 'mongoose';
import type { IMemberDb } from '../types';

const MemberSchema = new Schema(
  {
    discordId: {
      type: Schema.Types.String,
      required: true,
    },
    inviteCode: {
      type: Schema.Types.String,
    },
    inviteUses: {
      type: Schema.Types.Number,
      default: 0,
    },
    inviteValidUses: {
      type: Schema.Types.Number,
      default: 0,
    },
    completeAt: {
      type: Schema.Types.Date,
      required: false,
    },
    invitedMembers: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
  },
  { timestamps: true }
);

export const MemberModel = model<IMemberDb>('Member', MemberSchema);
