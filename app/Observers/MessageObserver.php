<?php

namespace App\Observers;

use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class MessageObserver
{
    public function deleting(Message $message)
    {
        // حذف امن attachments
        $message->attachments->each(function ($attachment) {
            try {
                $dir = dirname($attachment->path);
                Storage::disk('public')->deleteDirectory($dir);
            } catch (\Exception $e) {
                Log::error("Attachment deletion failed: " . $e->getMessage());
            }
        });

        // حذف ردیف‌های attachment از دیتابیس
        $message->attachments()->delete();

        // بروزرسانی پیام آخر گروه
        if ($message->group_id) {
            $group = Group::where('last_message_id', $message->id)->first();
            if ($group) {
                $prevMessage = Message::where('group_id', $message->group_id)
                    ->where('id', '!=', $message->id)
                    ->latest()
                    ->first();
                
                // اگر پیام قبلی وجود دارد، last_message_id را به آن بده، در غیر این صورت null
                $group->last_message_id = $prevMessage ? $prevMessage->id : null;
                $group->save();
            }
        } 
        // بروزرسانی پیام آخر کانورسیشن
        else {
            $conversation = Conversation::where('last_message_id', $message->id)->first();

            if ($conversation) {
                $prevMessage = Message::where(function ($query) use ($message) {
                    $query->where('sender_id', $message->sender_id)
                        ->where('receiver_id', $message->receiver_id)
                        ->orWhere(function ($query) use ($message) {
                            $query->where('sender_id', $message->receiver_id)
                                  ->where('receiver_id', $message->sender_id);
                        });
                })
                ->where('id', '!=', $message->id)
                ->latest()
                ->first();

                // اگر پیام قبلی وجود دارد، latest_message_id را به آن بده، در غیر این صورت null
                $conversation->last_message_id = $prevMessage ? $prevMessage->id : null;
                $conversation->save();
            }
        }
    }
}
