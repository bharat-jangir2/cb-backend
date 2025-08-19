import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CommunityController } from "./community.controller";
import { CommunityService } from "./community.service";
import { Comment, CommentSchema } from "./schemas/comment.schema";
import { Discussion, DiscussionSchema } from "./schemas/discussion.schema";
import { Quiz, QuizSchema } from "./schemas/quiz.schema";
import { Poll, PollSchema } from "./schemas/poll.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Discussion.name, schema: DiscussionSchema },
      { name: Quiz.name, schema: QuizSchema },
      { name: Poll.name, schema: PollSchema },
    ]),
  ],
  controllers: [CommunityController],
  providers: [CommunityService],
  exports: [CommunityService],
})
export class CommunityModule {}
