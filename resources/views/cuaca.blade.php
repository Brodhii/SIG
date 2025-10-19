@extends('layouts.app')

@section('content')
<div class="container mt-4">
    @if($lokasi)
        <div class="card shadow-sm mb-4">
            <div class="card-header bg-primary text-white">
                <h5 class="mb-0">
                    Prakiraan Cuaca: {{ $lokasi['desa'] }}, {{ $lokasi['kecamatan'] }}, {{ $lokasi['kotkab'] }}
                </h5>
            </div>
            <div class="card-body">
                <ul class="list-group">
                    @foreach($cuaca as $hari)
                        @foreach($hari as $jam)
                            <li class="list-group-item">
                                <strong>{{ $jam['local_datetime'] }}</strong><br> 
                                {{ $jam['weather_desc'] }}<br>
                                🌡️ Suhu: {{ $jam['t'] }}°C<br>
                                💧 Kelembapan: {{ $jam['hu'] }}%<br>
                                💨 Angin: {{ $jam['ws'] }} km/jam
                            </li>
                        @endforeach 
                    @endforeach
                </ul>
            </div>
        </div>
    @else
        <div class="alert alert-warning text-center">
            Data cuaca tidak tersedia
        </div>
    @endif
</div>
@endsection
