<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    public const ROLE_ENDMINISTRATOR = 'endministrator';
    public const ROLE_WARGA = 'warga';

    public const ROLES = [
        self::ROLE_ENDMINISTRATOR => 'Endministrator',
        self::ROLE_WARGA => 'Warga',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'otp',
        'otp_expires_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'otp',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'otp_expires_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // ── Role helpers ──

    public function isEndministrator(): bool
    {
        return $this->role === self::ROLE_ENDMINISTRATOR;
    }

    public function isWarga(): bool
    {
        return $this->role === self::ROLE_WARGA;
    }

    // ── OTP helpers ──

    public function generateOtp(): string
    {
        $otp = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $this->otp = $otp;
        $this->otp_expires_at = now()->addMinutes(5);
        $this->save();
        return $otp;
    }

    public function verifyOtp(string $code): bool
    {
        if ($this->otp && $this->otp === $code && $this->otp_expires_at?->isFuture()) {
            $this->otp = null;
            $this->otp_expires_at = null;
            $this->email_verified_at = now();
            $this->save();
            return true;
        }
        return false;
    }

    public function hasVerifiedEmail(): bool
    {
        return $this->email_verified_at !== null;
    }
}
