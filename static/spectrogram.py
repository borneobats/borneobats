from io import TextIOWrapper
import matplotlib.pyplot as plt
import matplotlib
import scipy.io.wavfile as wavfile

"""
Import all the required python packages! To import, simply open
command prompt and enter the command "py -m pip install <packgeName>" 
"""

#Enter the name of the audio file into 'path' variable
path = ''

rate, frames = wavfile.read(path)
fig, ax = plt.subplots()

#Change the 'vmin' parameter to suit your requirements
lst = ax.specgram(frames, Fs=rate, cmap='jet', vmin=-40, vmax=0)

cbar = fig.colorbar(lst[3])
cbar.set_label('Intensity (dB)')

#Set the bottom y-axis limit 
ax.set_ylim(bottom = 30000)
ax.set_xlim(left = 0)

#Set title of the spectrogram
title = ''

#If title is empty, the audio file path will become the title of the spectrogram
if title == '':
    ax.set_title(path)
else:
    ax.set_title(title)

ax.set_xlabel('Time (seconds)')
ax.set_ylabel('Frequency (kHz)')

scale = 1e3                     # KHz
ticks = matplotlib.ticker.FuncFormatter(lambda x, pos: '{0:g}'.format(x/scale))
ax.yaxis.set_major_formatter(ticks)

plt.show()