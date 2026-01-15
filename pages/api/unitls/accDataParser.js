// accDataParser.js - ACC数据解析器（修正版）
export default {
  /**
   * 解析完整的ACC HEX数据包
   * @param {string} hexString - HEX字符串
   * @returns {Object} 解析结果
   */
  parseAccData(hexString) {
    try {
      // 1. 将HEX字符串转换为字节数组
      const bytes = this.hexToBytes(hexString);
      
      if (bytes.length < 2) {
        throw new Error('数据长度不足');
      }
      
      // 2. 解析前两个字节
      const groupNumber = bytes[0];        // 序号 (1字节)
      const dataCount = bytes[1];          // 数据条数 Z (1字节)
      
      // console.log(`序号: ${groupNumber}, 数据条数: ${dataCount}`);
      
      // 3. 校验数据长度
      const expectedLength = 2 + dataCount * 10;
      if (bytes.length < expectedLength) {
        throw new Error(`数据长度不足，期望${expectedLength}字节，实际${bytes.length}字节`);
      }
      
      // 4. 解析ACC数据
      const accData = [];
      let offset = 2;
      
      for (let i = 0; i < dataCount; i++) {
        // 解析秒数（4字节，大端序 - 根据示例文档）
        // 字节顺序: [秒高位, ..., 秒低位] 大端序
        const seconds = (bytes[offset] << 24) |      // 最高位字节
                       (bytes[offset + 1] << 16) |   // 次高位
                       (bytes[offset + 2] << 8) |    // 次低位
                       (bytes[offset + 3]);          // 最低位
        
        // 解析X轴（2字节，大端序）
        const xRaw = (bytes[offset + 4] << 8) | bytes[offset + 5];
        const x = this.parseAccValue(xRaw);
        
        // 解析Y轴（2字节，大端序）
        const yRaw = (bytes[offset + 6] << 8) | bytes[offset + 7];
        const y = this.parseAccValue(yRaw);
        
        // 解析Z轴（2字节，大端序）
        const zRaw = (bytes[offset + 8] << 8) | bytes[offset + 9];
        const z = this.parseAccValue(zRaw);
        
        accData.push({
          index: i + 1,
          seconds: seconds,
          timeFormatted: this.formatTime(seconds),
          x: x,
          y: y,
          z: z,
          raw: {
            seconds: `0x${bytes[offset].toString(16).padStart(2, '0')}${bytes[offset+1].toString(16).padStart(2, '0')}${bytes[offset+2].toString(16).padStart(2, '0')}${bytes[offset+3].toString(16).padStart(2, '0')}`,
            x: `0x${xRaw.toString(16).padStart(4, '0')}`,
            y: `0x${yRaw.toString(16).padStart(4, '0')}`,
            z: `0x${zRaw.toString(16).padStart(4, '0')}`
          },
          hexPreview: this.getHexPreview(bytes, offset, 10)
        });
        
        offset += 10;
      }
      
      return {
        success: true,
        groupNumber: groupNumber,
        dataCount: dataCount,
        data: accData,
        rawLength: bytes.length,
        firstTimestamp: accData.length > 0 ? accData[0].seconds : 0,
        firstTimeFormatted: accData.length > 0 ? accData[0].timeFormatted : '00:00:00'
      };
      
    } catch (error) {
      console.error('ACC数据解析失败:', error);
      return {
        success: false,
        error: error.message,
        data: []
      };
    }
  },
  
  /**
   * 解析单个加速度值（最高位为符号位）
   * @param {number} rawValue - 原始16位值
   * @returns {number} 解析后的值
   */
  parseAccValue(rawValue) {
    // 检查参数有效性
    if (rawValue === undefined || rawValue === null) {
      return 0;
    }
    
    // 确保是16位无符号整数
    const value = rawValue & 0xFFFF;
    
    // 最高位（bit15）为符号位
    const isNegative = (value & 0x8000) !== 0;
    
    // 低15位为数值
    const magnitude = value & 0x7FFF;
    
    // 返回带符号的值
    return isNegative ? -magnitude : magnitude;
  },
  
  /**
   * 将HEX字符串转换为字节数组
   * @param {string} hexString - HEX字符串
   * @returns {Uint8Array} 字节数组
   */
  hexToBytes(hexString) {
    if (!hexString || typeof hexString !== 'string') {
      return new Uint8Array(0);
    }
    
    // 移除所有空格和换行
    const cleanHex = hexString.replace(/[\s\n\r]/g, '').toUpperCase();
    
    // 验证HEX格式
    if (!/^[0-9A-F]+$/.test(cleanHex)) {
      throw new Error('无效的HEX字符串');
    }
    
    // 检查长度是否为偶数
    if (cleanHex.length % 2 !== 0) {
      throw new Error('HEX字符串长度应为偶数');
    }
    
    const byteCount = cleanHex.length / 2;
    const bytes = new Uint8Array(byteCount);
    
    for (let i = 0; i < byteCount; i++) {
      const hexByte = cleanHex.substr(i * 2, 2);
      const byteValue = parseInt(hexByte, 16);
      
      if (isNaN(byteValue)) {
        throw new Error(`无效的HEX字节: ${hexByte}`);
      }
      
      bytes[i] = byteValue;
    }
    
    return bytes;
  },
  
  /**
   * 将秒数格式化为时间字符串
   * @param {number} seconds - 秒数
   * @returns {string} 格式化的时间
   */
  formatTime(seconds) {
    if (seconds === undefined || seconds === null || isNaN(seconds)) {
      return '00:00:00';
    }
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },
  
  /**
   * 获取HEX预览
   * @param {Uint8Array} bytes - 字节数组
   * @param {number} offset - 偏移量
   * @param {number} length - 长度
   * @returns {string} HEX字符串
   */
  getHexPreview(bytes, offset, length) {
    const end = Math.min(offset + length, bytes.length);
    let hexStr = '';
    
    for (let i = offset; i < end; i++) {
      hexStr += bytes[i].toString(16).padStart(2, '0') + ' ';
    }
    
    return hexStr.trim();
  },
  
  /**
   * 手动解析时间字节
   * @param {number} b1 - 字节1
   * @param {number} b2 - 字节2
   * @param {number} b3 - 字节3
   * @param {number} b4 - 字节4
   * @returns {number} 秒数
   */
  parseTimeBytes(b1, b2, b3, b4) {
    // 大端序：b1是最高位，b4是最低位
    return (b1 << 24) | (b2 << 16) | (b3 << 8) | b4;
  },
  
  /**
   * 详细解析示例数据
   */
  debugParseExample(testHex) {
    const bytes = this.hexToBytes(testHex);
    // 手动解析第一条数据的时间
    const firstDataOffset = 2;
    const timeBytes = [
      bytes[firstDataOffset],
      bytes[firstDataOffset + 1],
      bytes[firstDataOffset + 2],
      bytes[firstDataOffset + 3]
    ];
    
    // 大端序计算
    const secondsBigEndian = this.parseTimeBytes(...timeBytes);
    
    // 小端序计算（对比）
    const secondsLittleEndian = 
      (bytes[firstDataOffset + 3] << 24) |
      (bytes[firstDataOffset + 2] << 16) |
      (bytes[firstDataOffset + 1] << 8) |
      bytes[firstDataOffset];
    const result = this.parseAccData(testHex);
    
    // if (result.success) {
    //   console.log(`解析成功: 序号${result.groupNumber}, ${result.dataCount}条数据`);
    //   console.log('第一条数据:', {
    //     index: result.data[0].index,
    //     seconds: result.data[0].seconds,
    //     time: result.data[0].timeFormatted,
    //     x: result.data[0].x,
    //     y: result.data[0].y,
    //     z: result.data[0].z
    //   });
    // }
    
    return result;
  }
};

