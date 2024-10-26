import json
from channels.generic.websocket import AsyncWebsocketConsumer

class StockConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.symbol = self.scope['url_route']['kwargs']['symbol']
        await self.channel_layer.group_add(self.symbol, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.symbol, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        # Here, we can handle incoming messages if needed

    async def stock_update(self, event):
        # Log the received event to confirm it's being processed
        print(f"Received stock update for {event['symbol']}: {event['price']}")
        
        # Send stock update to WebSocket
        await self.send(text_data=json.dumps({
            'symbol': event['symbol'],
            'price': event['price'],
            'timestamp': event['timestamp']
        }))
