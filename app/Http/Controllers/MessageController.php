<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Group;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function byUser(User $user)
    {
        $messages = Message::where('sender_id', Auth::id())
        ->where('receiver_id', $user->id)->get()
        ->orWhere('sender_id', $user->id)
        ->where('receiver_id', Auth::id())->get()
        ->latest()
        ->paginate(10);
        return  inertia('Home', [
            'selectedConversation' => $user->toConversationArray(),
            'messages' => MessageResource::collection($messages),
        ]);
    }

    public function byGroup(Group $group)
    {
        // Logic to get messages by group
    }

    public function loadOlder(Message $message)
    {

    }

    public function store(StoreMessageRequest $request)
    {

    }

    public function destroy (Message $message)
    {

    }
}
