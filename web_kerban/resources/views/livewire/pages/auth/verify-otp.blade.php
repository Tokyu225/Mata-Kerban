<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Livewire\Attributes\Layout;
use Livewire\Volt\Component;

new #[Layout('layouts.guest')] class extends Component
{
    public string $email = '';
    public string $otp = '';

    public function mount(): void
    {
        $this->email = session('otp_email', '');
    }

    public function verify(): void
    {
        $this->validate([
            'otp' => ['required', 'string', 'size:6'],
        ]);

        $user = User::where('email', $this->email)->first();

        if (!$user) {
            $this->addError('otp', 'Akun tidak ditemukan.');
            return;
        }

        if ($user->verifyOtp($this->otp)) {
            Auth::login($user);
            session()->forget(['otp_email', 'otp_display']);
            $this->redirect(route('dashboard', absolute: false), navigate: true);
        } else {
            $this->addError('otp', 'Kode OTP salah atau sudah kadaluarsa.');
        }
    }

    public function resend(): void
    {
        $user = User::where('email', $this->email)->first();

        if (!$user) {
            $this->addError('otp', 'Akun tidak ditemukan.');
            return;
        }

        $otp = $user->generateOtp();

        // Send real email
        try {
            $user->notify(new \App\Notifications\OtpNotification($otp));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Gagal kirim ulang email OTP: ' . $e->getMessage());
        }

        \Illuminate\Support\Facades\Log::info("OTP (resend) untuk {$user->email}: {$otp}");
        session(['otp_display' => $otp]);

        session()->flash('status', 'Kode OTP baru telah dikirim ke email Anda.');
    }
}; ?>

<div>
    <div class="mb-4 text-sm text-gray-600">
        Masukkan kode OTP 6-digit yang telah dikirim ke email
        <strong>{{ $email }}</strong>.
        Kode berlaku selama <strong>5 menit</strong>.
    </div>

    <!-- Session Status -->
    <x-auth-session-status class="mb-4" :status="session('status')" />

    @if(session('otp_display'))
        <div class="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-md text-sm text-yellow-800">
            <strong>🔑 DEV MODE — OTP:</strong>
            <span class="font-mono text-lg font-bold ml-2">{{ session('otp_display') }}</span>
        </div>
    @endif

    <form wire:submit="verify">
        <!-- OTP Code -->
        <div>
            <x-input-label for="otp" :value="__('Kode OTP')" />
            <x-text-input
                wire:model="otp"
                id="otp"
                class="block mt-1 w-full text-center text-2xl tracking-[0.5em] font-mono"
                type="text"
                name="otp"
                inputmode="numeric"
                maxlength="6"
                autocomplete="one-time-code"
                required
                autofocus
                placeholder="000000" />
            <x-input-error :messages="$errors->get('otp')" class="mt-2" />
        </div>

        <div class="flex items-center justify-between mt-4">
            <button type="button" wire:click="resend" class="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                {{ __('Kirim Ulang Kode') }}
            </button>

            <x-primary-button>
                {{ __('Verifikasi & Masuk') }}
            </x-primary-button>
        </div>
    </form>
</div>
