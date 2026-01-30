import EscPosEncoder from 'esc-pos-encoder';

export interface ReceiptData {
    transactionId: string;
    timestamp: Date;
    items: {
        name: string;
        qty: number;
        price: number;
        subtotal: number;
    }[];
    subtotal: number;
    discount?: {
        name: string;
        amount: number;
    };
    total: number;
    paymentMethod: string;
    employeeName?: string;
}

export class BluetoothPrinter {
    private device: any = null;
    private server: any = null;
    private characteristic: any = null;

    async connect(): Promise<boolean> {
        try {
            if (this.device && this.device.gatt.connected) return true;

            this.device = await (navigator as any).bluetooth.requestDevice({
                filters: [
                    { services: ['000018f0-0000-1000-8000-00805f9b34fb'] }, // Common for thermal printers
                    { namePrefix: 'InnerPrinter' },
                    { namePrefix: 'MPT' },
                    { namePrefix: 'BT printer' }
                ],
                optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb']
            });

            this.server = await this.device.gatt.connect();
            const service = await this.server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb');
            this.characteristic = await service.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb');

            return true;
        } catch (error) {
            console.error('Bluetooth connection failed:', error);
            return false;
        }
    }

    async print(data: ReceiptData): Promise<boolean> {
        try {
            if (!this.characteristic) {
                const connected = await this.connect();
                if (!connected) return false;
            }

            const encoder = new EscPosEncoder();

            let result = encoder
                .initialize()
                .codepage('cp850')
                .align('center')
                .bold(true)
                .line('EXAMPLE COFFE')
                .bold(false)
                .line('Cicalengka, Bandung')
                .line('Every moment feels lighter')
                .line('--------------------------------')
                .align('left')
                .line(`ID: ${data.transactionId}`)
                .line(`Waktu: ${data.timestamp.toLocaleString('id-ID')}`)
                .line('--------------------------------');

            data.items.forEach(item => {
                const itemLine = `${item.name}`;
                const priceLine = `${item.qty} x ${item.price.toLocaleString('id-ID')}   ${item.subtotal.toLocaleString('id-ID')}`;
                result = result.line(itemLine).line(priceLine);
            });

            result = result
                .line('--------------------------------')
                .align('right')
                .line(`Subtotal: Rp ${data.subtotal.toLocaleString('id-ID')}`);

            if (data.discount && data.discount.amount > 0) {
                result = result.line(`Disc (${data.discount.name}): -${data.discount.amount.toLocaleString('id-ID')}`);
            }

            result = result
                .bold(true)
                .line(`TOTAL: Rp ${data.total.toLocaleString('id-ID')}`)
                .bold(false)
                .align('left')
                .line(`Metode: ${data.paymentMethod}`)
                .line(`Kasir: ${data.employeeName || '-'}`)
                .line('--------------------------------')
                .align('center')
                .line('Terima kasih')
                .line('Selamat menikmati!')
                .newline()
                .newline()
                .newline()
                .cut();

            const resultBytes = result.encode();

            // Send data in chunks to avoid buffer overflow
            const chunkSize = 20;
            for (let i = 0; i < resultBytes.length; i += chunkSize) {
                const chunk = resultBytes.slice(i, i + chunkSize);
                await this.characteristic.writeValue(chunk);
            }

            return true;
        } catch (error) {
            console.error('Printing failed:', error);
            return false;
        }
    }
}

export const printer = new BluetoothPrinter();
