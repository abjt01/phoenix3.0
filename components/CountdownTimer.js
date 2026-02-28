'use client';
import { useState, useEffect } from 'react';

const getDiff = (targetDate) => Math.max(0, new Date(targetDate) - Date.now());

export default function CountdownTimer({ targetDate }) {
    const [mounted, setMounted] = useState(false);
    const [diff, setDiff] = useState(0);

    useEffect(() => {
        setMounted(true);
        if (!targetDate) return;
        setDiff(getDiff(targetDate));

        const id = setInterval(() => setDiff(getDiff(targetDate)), 200);
        return () => clearInterval(id);
    }, [targetDate]);

    if (!targetDate) return null;
    if (mounted && diff === 0) return null;

    const units = [
        { label: 'Days', value: mounted ? Math.floor(diff / 86400000) : 0 },
        { label: 'Hours', value: mounted ? Math.floor(diff / 3600000) % 24 : 0 },
        { label: 'Min', value: mounted ? Math.floor(diff / 60000) % 60 : 0 },
        { label: 'Sec', value: mounted ? Math.floor(diff / 1000) % 60 : 0 },
    ];

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'clamp(2px, 1vw, 12px)',
        }}>
            {units.map((unit, i) => (
                <div key={unit.label} style={{ display: 'flex', alignItems: 'center', gap: 'clamp(2px, 1vw, 12px)' }}>
                    {/* Card */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '8px 0px',
                        minWidth: '56px',
                    }}>
                        <span suppressHydrationWarning style={{
                            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                            fontWeight: 800,
                            lineHeight: 1,
                            letterSpacing: '-0.02em',
                            // background: 'linear-gradient(135deg, #ff6900 0%, #ffb27c 50%, #57d2fd 100%)',
                            // WebkitBackgroundClip: 'text',
                            // WebkitTextFillColor: 'transparent',
                            // backgroundClip: 'text',
                            color: '#fff',
                            opacity: 0.8,
                            fontVariantNumeric: 'tabular-nums',
                        }}>
                            {String(unit.value).padStart(2, '0')}
                        </span>
                        <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: 'rgba(255, 255, 255, 0.35)',
                            marginTop: '6px',
                        }}>
                            {unit.label}
                        </span>
                    </div>
                    {/* Colon separator */}
                    {i < units.length - 1 && (
                        <span style={{
                            fontSize: 'clamp(1.25rem, 3vw, 1.5rem)',
                            fontWeight: 700,
                            color: 'rgba(255, 255, 255, 0.15)',
                            lineHeight: 1,
                            marginBottom: '16px',
                        }}>
                            :
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}