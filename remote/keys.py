from adafruit_mcp230xx.mcp23017 import MCP23017
import busio
import digitalio
import board

class Keys:

    def __init__(self,addresses,interruptpins):
        self.buttons = [0]*32
        self.released = []
        self.held = []

        i2c = busio.I2C(board.SCL, board.SDA)
        self.mcp = [MCP23017(i2c, address=i, reset=True) for i in addresses]
        for expander in self.mcp:
            expander.iodir = 65535
            expander.gppu = 65535
            expander.default_value = 0
            expander.ipol = 65535
            expander.interrupt_configuration = 65535
            expander.interrupt_enable = 65535

        self.interrupts = [digitalio.DigitalInOut(i) for i in interruptpins]
        for pin in self.interrupts:
            pin.switch_to_input(pull=digitalio.Pull.UP)

    def update(self):
        self.released.clear()
        self.held.clear()

        for i, interrupt in enumerate(self.interrupts):
            if not interrupt.value:
                for pressed in self.mcp[i].int_flag:
                    self.buttons[pressed + 16 * i] += 1
                    if self.buttons[pressed + 16 * i] > 15:
                        self.held.append(pressed + 16 * i)
                self.mcp[i].gpio
            else:
                for r in range(16 * i, 16 + 16 * i):
                    if self.buttons[r] > 1:
                        self.released.append(r)
                    self.buttons[r] = 0