<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('message_attachments', function (Blueprint $table) {
            $table->bigInteger('size')->nullable(); // یا integer اگر کوچک‌تره
        });
    }

    /**
     * Reverse the migrations.
     */
public function down()
{
    Schema::table('message_attachments', function (Blueprint $table) {
        $table->dropColumn('size');
    });
}
};
