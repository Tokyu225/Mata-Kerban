<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Auth\MustVerifyEmail as MustVerifyEmailTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, MustVerifyEmailTrait;

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
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
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


}
