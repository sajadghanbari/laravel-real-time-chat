<?php

namespace App\Jobs;

use App\Events\GroupDeleted;
use App\Models\Group;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class DeleteGroupJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */


    /**
     * Execute the job.
     */
    public function __construct(public int $groupId) {}

    public function handle(): void
    {
        $group = Group::with('messages', 'users')->find($this->groupId);

        if (!$group) {
            return; // شاید قبلاً پاک شده باشه
        }

        $id = $group->id;
        $name = $group->name;

        $group->last_message_id = null;
        $group->save();

        $group->messages()->each(fn($m) => $m->delete());

        $group->users()->detach();

        $group->delete();

        GroupDeleted::dispatch($id, $name);
    }
}
