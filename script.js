// Inicializa las órdenes desde el Local Storage
const loadOrdersFromLocalStorage = () => {
  const orders = JSON.parse(localStorage.getItem('orders')) || {
      waiting: [],
      inProgress: [],
      completed: []
  };
  return orders;
};

// Guarda las órdenes en el Local Storage
const saveOrdersToLocalStorage = (orders) => {
  localStorage.setItem('orders', JSON.stringify(orders));
};

// Carga las órdenes al inicio
let orders = loadOrdersFromLocalStorage();
renderOrders();

function renderOrders() {
  // Limpiar contenedores
  document.getElementById('waitingContainer').innerHTML = '';
  document.getElementById('surtidoContainer').innerHTML = '';
  document.getElementById('completedContainer').innerHTML = '';

  // Renderizar órdenes en espera
  orders.waiting.forEach(order => {
      const orderItem = document.createElement('div');
      orderItem.className = 'order-item';
      orderItem.innerHTML = `
          <span>RP: ${order.rp.join(', ')} - Cantidad: ${order.cantidad}</span>
          <button class="btn-iniciar" data-rp="${order.rp.join(', ')}">Iniciar</button>
      `;
      document.getElementById('waitingContainer').appendChild(orderItem);
  });

  // Renderizar órdenes en progreso
  orders.inProgress.forEach(order => {
      const surtidoItem = document.createElement('div');
      surtidoItem.className = 'surtido-item';
      const elapsedMinutes = Math.floor((Date.now() - order.startTime) / 60000);
      const totalPieces = order.piezas;
      const totalTime = totalPieces / 450 * 60 ; // Minutos totales para completar
      const progressPercentage = Math.min((elapsedMinutes / totalTime) * 100, 100); // Asegurarse de que no supere 100
      const status = elapsedMinutes < totalTime ? 'A tiempo' : 'Retraso'; // Evaluar si está a tiempo o con retraso
      
      // Formatear la hora de inicio
      const startTime = new Date(order.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

      surtidoItem.innerHTML = `
          <span>Nombre: ${order.surtidor} - Piezas: ${totalPieces} - RP: ${order.rp.join(', ')} - Inicio: ${startTime}</span>
          <div class="progress-bar-container">
              <div class="progress-bar" style="width: ${progressPercentage}%; background-color: ${status === 'Retraso' ? 'red' : 'green'};"></div>
          </div>
          <span class="timeStatus"> - ${status}</span>
          <button class="btn-terminar">Terminar</button>
      `;
      document.getElementById('surtidoContainer').appendChild(surtidoItem);
  });

  // Renderizar órdenes completadas
  orders.completed.forEach(order => {
      const completedItem = document.createElement('div');
      completedItem.className = 'completed-item';
      completedItem.innerHTML = `
          <span>Nombre: ${order.surtidor} - Piezas: ${order.piezas} - RP: ${order.rp.join(', ')} - Completado</span>
      `;
      document.getElementById('completedContainer').appendChild(completedItem);
  });
}

// Manejador de evento para agregar orden en espera
document.getElementById('ordenesForm').addEventListener('submit', function (event) {
  event.preventDefault();
  const cantidadInput = document.getElementById('cantidad').value;
  const rpInput = document.getElementById('rp').value.split(',').map(rp => rp.trim());
  
  orders.waiting.push({ 
      rp: rpInput, 
      cantidad: parseInt(cantidadInput) // Agregamos la cantidad de piezas aquí
  });
  saveOrdersToLocalStorage(orders);
  renderOrders();
  document.getElementById('ordenesForm').reset();
});

// Manejador de evento para iniciar una orden
document.getElementById('waitingContainer').addEventListener('click', function (event) {
  if (event.target.classList.contains('btn-iniciar')) {
      const rp = event.target.getAttribute('data-rp');
      const surtidor = prompt('Ingrese el nombre del surtidor:');
      const selectedOrder = orders.waiting.find(order => order.rp.join(', ') === rp);
      
      if (selectedOrder) {
          orders.inProgress.push({
              surtidor: surtidor,
              piezas: selectedOrder.cantidad, // Usar la cantidad de piezas aquí
              rp: selectedOrder.rp,
              startTime: Date.now() // Guardar la hora de inicio
          });
          orders.waiting = orders.waiting.filter(order => order !== selectedOrder);
          saveOrdersToLocalStorage(orders);
          renderOrders();
      }
  }
});

// Manejador de evento para terminar una orden
document.getElementById('surtidoContainer').addEventListener('click', function (event) {
  if (event.target.classList.contains('btn-terminar')) {
      const surtidoItem = event.target.parentElement;
      const surtidor = surtidoItem.querySelector('span').textContent.split(' - ')[0].split(': ')[1];
      const piezas = parseInt(surtidoItem.querySelector('span').textContent.split(' - ')[1].split(': ')[1]);
      const rp = surtidoItem.querySelector('span').textContent.split(' - ')[2].split(': ')[1];

      orders.completed.push({
          surtidor: surtidor,
          piezas: piezas,
          rp: rp.split(', ')
      });
      
      const orderIndex = orders.inProgress.findIndex(order => order.surtidor === surtidor && order.rp.join(', ') === rp);
      if (orderIndex > -1) {
          orders.inProgress.splice(orderIndex, 1);
          saveOrdersToLocalStorage(orders);
          renderOrders();
      }
  }
});

// Manejador de evento para limpiar órdenes completadas
document.getElementById('btnLimpiar').addEventListener('click', function () {
  orders.completed = []; // Limpiar la lista de completadas
  saveOrdersToLocalStorage(orders);
  renderOrders();
});

// Al cargar la página
document.addEventListener('DOMContentLoaded', renderOrders);
