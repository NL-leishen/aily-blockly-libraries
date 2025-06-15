// 定义u8g2_begin块的动态输入扩展
if (Blockly.Extensions.isRegistered('u8g2_begin_dynamic_inputs')) {
  Blockly.Extensions.unregister('u8g2_begin_dynamic_inputs');
}
Blockly.Extensions.register('u8g2_begin_dynamic_inputs', function () {
  // 保存block的引用
  var thisBlock = this;

  // 定义更新函数，用于根据PROTOCOL值动态更新输入
  function updateShape() {
    var protocolValue = thisBlock.getFieldValue('PROTOCOL');

    // 统一移除所有可能存在的输入
    if (thisBlock.getInput('I2C_PINS')) thisBlock.removeInput('I2C_PINS');
    if (thisBlock.getInput('SW_I2C_PINS')) thisBlock.removeInput('SW_I2C_PINS');
    if (thisBlock.getInput('3W_SPI_PINS')) thisBlock.removeInput('3W_SPI_PINS');
    if (thisBlock.getInput('3W_SW_SPI_PINS')) thisBlock.removeInput('3W_SW_SPI_PINS');
    if (thisBlock.getInput('4W_SPI_PINS')) thisBlock.removeInput('4W_SPI_PINS');
    if (thisBlock.getInput('4W_SW_SPI_PINS')) thisBlock.removeInput('4W_SW_SPI_PINS');

    // 根据选择添加配置项目
    switch (protocolValue) {
      case '_HW_I2C':
        // 添加I2C配置
        thisBlock.appendDummyInput('I2C_PINS')
          .appendField('引脚RST')
          .appendField(new Blockly.FieldTextInput('U8X8_PIN_NONE'), 'RESET_PIN');
        break;

      case '_SW_I2C':
        // 添加软件I2C配置
        thisBlock.appendDummyInput('SW_I2C_PINS')
          .appendField('引脚SCL')
          .appendField(new Blockly.FieldTextInput('13'), 'CLOCK_PIN')
          .appendField('SDA')
          .appendField(new Blockly.FieldTextInput('11'), 'DATA_PIN')
          .appendField('RST')
          .appendField(new Blockly.FieldTextInput('8'), 'RESET_PIN');
        break;

      case '_3W_HW_SPI':
        // 添加3线硬件SPI配置
        thisBlock.appendDummyInput('3W_SPI_PINS')
          .appendField('引脚CS')
          .appendField(new Blockly.FieldTextInput('10'), 'CS_PIN')
          .appendField('RST')
          .appendField(new Blockly.FieldTextInput('8'), 'RESET_PIN');
        break;

      case '_3W_SW_SPI':
        // 添加3线软件SPI配置
        thisBlock.appendDummyInput('3W_SW_SPI_PINS')
          .appendField('引脚CLK')
          .appendField(new Blockly.FieldTextInput('13'), 'CLOCK_PIN')
          .appendField('DATA')
          .appendField(new Blockly.FieldTextInput('11'), 'DATA_PIN')
          .appendField('CS')
          .appendField(new Blockly.FieldTextInput('10'), 'CS_PIN')
          .appendField('RST')
          .appendField(new Blockly.FieldTextInput('8'), 'RESET_PIN');
        break;

      case '_4W_HW_SPI':
        // 添加4线硬件SPI配置
        thisBlock.appendDummyInput('4W_SPI_PINS')
          .appendField('引脚CS')
          .appendField(new Blockly.FieldTextInput('10'), 'CS_PIN')
          .appendField('DC')
          .appendField(new Blockly.FieldTextInput('9'), 'DC_PIN')
          .appendField('RST')
          .appendField(new Blockly.FieldTextInput('8'), 'RESET_PIN');
        break;

      case '_4W_SW_SPI':
        // 添加4线软件SPI配置
        thisBlock.appendDummyInput('4W_SW_SPI_PINS')
          .appendField('引脚CLK')
          .appendField(new Blockly.FieldTextInput('13'), 'CLOCK_PIN')
          .appendField('DATA')
          .appendField(new Blockly.FieldTextInput('11'), 'DATA_PIN')
          .appendField('CS')
          .appendField(new Blockly.FieldTextInput('10'), 'CS_PIN')
          .appendField('DC')
          .appendField(new Blockly.FieldTextInput('9'), 'DC_PIN')
          .appendField('RST')
          .appendField(new Blockly.FieldTextInput('8'), 'RESET_PIN');
        break;

      default:
        // 默认情况下不添加任何输入
        break;
    }
  }
  // 初始化时运行一次更新
  updateShape();

  // 监听PROTOCOL字段的变化
  this.setOnChange(function (changeEvent) {
    if (changeEvent.type === Blockly.Events.BLOCK_CHANGE &&
      changeEvent.element === 'field' &&
      changeEvent.name === 'PROTOCOL') {
      updateShape();
    }
  });
});

Arduino.forBlock['u8g2_begin'] = function (block, generator) {
  var type = block.getFieldValue('TYPE');
  var resolution = block.getFieldValue('RESOLUTION');
  var protocol = block.getFieldValue('PROTOCOL');

  // 构建基础的构造函数名称
  var code = 'U8G2_' + type + '_' + resolution + protocol + ' u8g2(';

  // 根据不同的协议类型添加对应的引脚参数
  switch (protocol) {
    case '_HW_I2C':
      // 硬件I2C只需要重置引脚
      var resetPin = block.getFieldValue('RESET_PIN');
      code += 'U8G2_R0, ' + resetPin;
      break;

    case '_SW_I2C':
      // 软件I2C需要时钟、数据和重置引脚
      var clockPin = block.getFieldValue('CLOCK_PIN');
      var dataPin = block.getFieldValue('DATA_PIN');
      var resetPin = block.getFieldValue('RESET_PIN');
      code += 'U8G2_R0, ' + clockPin + ', ' + dataPin + ', ' + resetPin;
      break;

    case '_3W_HW_SPI':
      // 3线硬件SPI需要片选和重置引脚
      var csPin = block.getFieldValue('CS_PIN');
      var resetPin = block.getFieldValue('RESET_PIN');
      code += 'U8G2_R0, ' + csPin + ', ' + resetPin;
      break;

    case '_3W_SW_SPI':
      // 3线软件SPI需要时钟、数据、片选和重置引脚
      var clockPin = block.getFieldValue('CLOCK_PIN');
      var dataPin = block.getFieldValue('DATA_PIN');
      var csPin = block.getFieldValue('CS_PIN');
      var resetPin = block.getFieldValue('RESET_PIN');
      code += 'U8G2_R0, ' + clockPin + ', ' + dataPin + ', ' + csPin + ', ' + resetPin;
      break;

    case '_4W_HW_SPI':
      // 4线硬件SPI需要DC、片选和重置引脚
      var dcPin = block.getFieldValue('DC_PIN');
      var csPin = block.getFieldValue('CS_PIN');
      var resetPin = block.getFieldValue('RESET_PIN');
      code += 'U8G2_R0, ' + dcPin + ', ' + csPin + ', ' + resetPin;
      break;

    case '_4W_SW_SPI':
      // 4线软件SPI需要时钟、数据、片选、DC和重置引脚
      var clockPin = block.getFieldValue('CLOCK_PIN');
      var dataPin = block.getFieldValue('DATA_PIN');
      var csPin = block.getFieldValue('CS_PIN');
      var dcPin = block.getFieldValue('DC_PIN');
      var resetPin = block.getFieldValue('RESET_PIN');
      code += 'U8G2_R0, ' + clockPin + ', ' + dataPin + ', ' + csPin + ', ' + dcPin + ', ' + resetPin;
      break;

    default:
      // 默认情况，只添加旋转参数
      code += 'U8G2_R0';
      break;
  }

  code += ');';

  generator.addLibrary('u8g2', '#include <U8g2lib.h>');
  generator.addObject('u8g2', code);
  return 'u8g2.begin();\n';
};


Arduino.forBlock['u8g2_clear'] = function (block, generator) {
  return `u8g2.clear();\n`;
};

Arduino.forBlock['u8g2_draw_pixel'] = function (block, generator) {
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC);
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC);
  return `u8g2.drawPixel(${x}, ${y});\n`;
};

Arduino.forBlock['u8g2_draw_line'] = function (block, generator) {
  const x1 = generator.valueToCode(block, 'X1', Arduino.ORDER_ATOMIC);
  const y1 = generator.valueToCode(block, 'Y1', Arduino.ORDER_ATOMIC);
  const x2 = generator.valueToCode(block, 'X2', Arduino.ORDER_ATOMIC);
  const y2 = generator.valueToCode(block, 'Y2', Arduino.ORDER_ATOMIC);

  return `u8g2.drawLine(${x1}, ${y1}, ${x2}, ${y2});\n`;
};

Arduino.forBlock['u8g2_draw_rectangle'] = function (block, generator) {
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC);
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC);
  const width = generator.valueToCode(block, 'WIDTH', Arduino.ORDER_ATOMIC);
  const height = generator.valueToCode(block, 'HEIGHT', Arduino.ORDER_ATOMIC);
  const fill = block.getFieldValue('FILL') === 'TRUE';

  if (fill) {
    return `u8g2.drawBox(${x}, ${y}, ${width}, ${height});\n`;
  } else {
    return `u8g2.drawFrame(${x}, ${y}, ${width}, ${height});\n`;
  }
};

Arduino.forBlock['u8g2_draw_circle'] = function (block, generator) {
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC);
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC);
  const radius = generator.valueToCode(block, 'RADIUS', Arduino.ORDER_ATOMIC);
  const fill = block.getFieldValue('FILL') === 'TRUE';

  if (fill) {
    return `u8g2.drawDisc(${x}, ${y}, ${radius});\n`;
  } else {
    return `u8g2.drawCircle(${x}, ${y}, ${radius});\n`;
  }
};

Arduino.forBlock['u8g2_draw_str'] = function (block, generator) {
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC);
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC);
  const text = generator.valueToCode(block, 'TEXT', Arduino.ORDER_ATOMIC);
  // 简化版的显示文本（自带清屏和刷新）
  return `u8g2.drawStr(${x}, ${y}, ${text});\nu8g2.sendBuffer();\n`;
};

Arduino.forBlock['u8g2_draw_bitmap'] = function (block, generator) {
  const x = generator.valueToCode(block, 'X', Arduino.ORDER_ATOMIC);
  const y = generator.valueToCode(block, 'Y', Arduino.ORDER_ATOMIC);
  const bitmap = generator.valueToCode(block, 'BITMAP', Arduino.ORDER_ATOMIC);
  
  // 从bitmap值中提取图像信息
  // 假设bitmap返回的是图像变量名
  return `u8g2.drawXBM(${x}, ${y}, bitmap_width, bitmap_height, ${bitmap});\n`;
};

Arduino.forBlock['u8g2_bitmap'] = function (block, generator) {
  const bitmapData = block.getFieldValue('CUSTOM_CHAR');
  
  // 生成一个唯一的变量名
  const bitmapVarName = 'bitmap_' + generator.getUid();
  
  // 将bitmap数据转换为XBM格式的C数组
  // 这里需要根据实际的bitmap数据格式进行解析
  const width = 128; // 从字段配置中获取
  const height = 64; // 从字段配置中获取
  
  // 添加bitmap数据到程序的变量部分
  generator.addVariable(
    bitmapVarName,
    `static const unsigned char ${bitmapVarName}[] PROGMEM = {
  // Bitmap data: ${bitmapData}
};
const int bitmap_width = ${width};
const int bitmap_height = ${height};`
  );
  
  return [bitmapVarName, Arduino.ORDER_ATOMIC];
};