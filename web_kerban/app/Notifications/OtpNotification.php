<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OtpNotification extends Notification
{
    use Queueable;

    public function __construct(public string $otp) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Kode OTP Verifikasi — Dusun Kerban')
            ->greeting('Halo, ' . $notifiable->name . '!')
            ->line('Berikut adalah kode OTP Anda untuk verifikasi akun Dusun Kerban:')
            ->line('**' . $this->otp . '**')
            ->line('Kode ini berlaku selama **5 menit**. Jangan bagikan kode ini kepada siapa pun.')
            ->salutation('Salam, Tim Dusun Kerban');
    }
}
