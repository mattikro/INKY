import board
import busio
import alarm
import digitalio
import time
from keys import Keys

keys = Keys(addresses=[0x20, 0x27], interruptpins=[board.D12, board.D9])
pin_alarm = alarm.pin.PinAlarm(pin=board.D5, value=False, pull=True)

lastPress = time.time()
while True:
    if keys.released:
        print('Released:', keys.released)
        lastPress = time.time()
    if keys.held:
        print('held:', keys.held)
        for key in keys.held:
            keys.buttons[key] = -99999
        lastPress = time.time()
    if time.time() - lastPress > 5:
        alarm.exit_and_deep_sleep_until_alarms(pin_alarm)
        lastPress = time.time()

    keys.update()
