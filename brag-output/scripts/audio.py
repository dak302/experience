# Mixe la musique et les bruitages, tous calés sur la grille des pulsations (110 BPM, 1re pulsation à 0,267 s)
import subprocess, sys
A = '/root/.claude/skills/brag/assets'
out = sys.argv[1]
B = lambda n: 0.267 + 0.5455 * n
cues = []  # (fichier, temps, gain en dB)
cues.append(('sfx/ui/click2.ogg', B(7), -16))                 # toucher sur le dépôt du PDF
cues.append(('sfx/interface/bong_001.ogg', B(8), -14))        # « הקובץ נקרא ואומת »
for n in (17, 19, 21):
    cues.append(('sfx/ui/click2.ogg', B(n), -16))             # le משק coche une ligne
for k in range(9):
    cues.append(('sfx/interface/click_003.ogg', B(27) + k * 0.5455 / 2, -26))  # frappe, en croches
cues.append(('sfx/interface/bong_001.ogg', B(32), -14))       # « סיימת, נשאר רק לשלוח למשק »
cues.append(('sfx/impact/impactSoft_medium_001.ogg', B(40), -18))  # arrivée du nom
args = ['ffmpeg', '-loglevel', 'error', '-y', '-i', f'{A}/music/happy-beats-business-moves-vol-10-by-ende-dot-app.mp3']
for f, _, _ in cues:
    args += ['-i', f'{A}/{f}']
fl = ['[0:a]atrim=0:25,asetpts=PTS-STARTPTS,volume=-1dB,afade=t=in:st=0:d=0.04,afade=t=out:st=23.6:d=1.4[m]']
labels = ['[m]']
for i, (f, t, g) in enumerate(cues, 1):
    ms = int(round(t * 1000))
    fl.append(f'[{i}:a]aresample=44100,aformat=channel_layouts=stereo,volume={g}dB,adelay={ms}|{ms}[s{i}]')
    labels.append(f'[s{i}]')
fl.append(''.join(labels) + f'amix=inputs={len(labels)}:normalize=0:duration=first,alimiter=limit=0.89,atrim=0:25[a]')
args += ['-filter_complex', ';'.join(fl), '-map', '[a]', '-c:a', 'pcm_s16le', '-ar', '44100', out]
subprocess.run(args, check=True)
