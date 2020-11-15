(function () {
	renderAv();
	renderRent();
	////////////////////////////available start/////////////////////
	///////////////////////available POST///////////////////////
	document.querySelectorAll('.create-form').forEach(createForm => {
		createForm.addEventListener('submit', function (event) {

			addAv({
				name: this.bikeName.value,
				type: this.bikeType.value,
				price: this.rentPrice.value
			});
		});
	});

	function addAv(data) {
		return fetch('http://localhost:5000/available', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		});
	}
	///////////////////////available render///////////////////////
	function renderAv() {
		return fetch(`http://localhost:5000/available`)
			.then(response => response.json())
			.then(available);
	}

	function available(items) {
		let availableList = document.querySelector('#available');

		items.forEach(availableItem => {

			if (availableItem._id == '') {
				return;
			} else {
				let storData = {
					name: availableItem.name,
					type: availableItem.type,
					price: availableItem.price
				}
				localStorage.setItem(availableItem._id, JSON.stringify(storData));

				availableList.insertAdjacentHTML('beforeend', `
			<form id="${availableItem._id}" class="bg-white rounded border d-flex flex-column flex-lg-row justify-content-between align-items-center align-items-lg-end py-3 px-5 mt-3 unit">
			<div class="d-flex flex-column flex-lg-row w-50">
				<input type="text" name="bikeInfo" readonly class="form-control-plaintext" value="${availableItem.name}    /    ${availableItem.type}    /    ${availableItem.price}$/h">
				<div class="ml-lg-5">
					<label>Rent&#160Time</label>
					<input type="number" name="rentHours" class="form-control" min="1" max="72" required placeholder="24h">
				</div>
			</div>
			<button type="submit" class="btn btn-primary my-2 my-lg-0 rent">Rent</button> 
			<button type="button" class="btn btn-danger delete">Delete</button>
			</form>
					`);
			}
		});

		availableUnits();
		unt();
	}
	/////////////////////////available title///////////////////
	function availableUnits() {
		let totalUnits = document.querySelectorAll('.unit');
		let unitsLength = totalUnits.length;

		if (unitsLength == 0) {
			document.querySelector('#available').insertAdjacentHTML('afterbegin', `
		<strong>🚲 Available bicycles (0)</br><p class="text-danger">If rent time of the bike more than 20 hours you have SALE 50% !*</p></strong>
		`);
		} else {
			document.querySelector('#available').insertAdjacentHTML('afterbegin', `
			<strong class="strong">🚲 Available bicycles (${unitsLength})</br><p class="text-danger">If rent time of the bike more than 20 hours you have SALE 50% !*</p></strong>
		`);
		}
	}
	//////////////////////available DELETE//////////////////////
	function deleleAv() {
		document.querySelector('#available').addEventListener('click', event => {
			if (event.target.matches('button[class*="delete"]')) {
				event.target.closest('form.unit').remove();

				let strong = document.querySelector('.strong');
				strong.innerHTML = '';
				availableUnits();

				let parent = event.target.parentElement;
				let id = parent.getAttribute('id');

				localStorage.removeItem(id);
				deleteAvServer(id);
			}
		});
	}
	deleleAv();

	function deleteAvServer(id) {
		return fetch('http://localhost:5000/available/' + id, {
			method: 'DELETE',
		})
	}
	/////////////////////////////////////available end//////////////////////

	/////////////////////////////////////rent start//////////////////////
	/////////////////////////////////////rent POST//////////////////////
	function unt() {
		document.querySelectorAll('.unit').forEach(unit => {
			unit.addEventListener('submit', function (event) {
				event.preventDefault();

				let id = event.target.getAttribute('id');
				let unitEl = JSON.parse(localStorage.getItem(id));

				let cost = sum(unitEl.price, this.rentHours.value);

				localStorage.removeItem(id);

				addRent({
					name: unitEl.name,
					type: unitEl.type,
					price: unitEl.price,
					time: this.rentHours.value,
					cost: cost
				});

				event.target.closest('form.unit').remove();

				let strong = document.querySelector('.strong');
				strong.innerHTML = '';

				availableUnits();
				deleteAvServer(id);
				window.location.reload();
			});
		});
	}
	//////////////////////rent total//////////////////////
	function sum(a, b) {
		if (b > 20) {
			let c = a / 2;
			return c * b;
		} else {
			return a * b;
		}
	}

	function addRent(data) {
		return fetch('http://localhost:5000/rent', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		})
	}
	/////////////////////////////////////rent GET//////////////////////
	function renderRent() {
		return fetch(`http://localhost:5000/rent`)
			.then(response => response.json())
			.then(rent);
	}

	function rent(items) {
		let rentList = document.querySelector('#rent');
		let sum = [];

		if (items.length == 0) {
			rentList.insertAdjacentHTML('afterbegin', `
			<strong>🤩 Your rent (Total: $0)</strong>
		`);
		} else {
			items.forEach(rentItem => {
				let storData = {
					name: rentItem.name,
					type: rentItem.type,
					price: rentItem.price
				}
				localStorage.setItem(rentItem._id, JSON.stringify(storData));

				rentList.insertAdjacentHTML('beforeend', `
				<form id="${rentItem._id}" class="bg-white rounded border d-flex flex-column flex-lg-row align-items-center justify-content-between py-3 px-5 mt-3 unit-rent">
				<input type="text" readonly class="w-60 form-control-plaintext"
					value="${rentItem.name}  /  ${rentItem.type}  /  ${rentItem.price}$/h  /  ${rentItem.time} hours">
				<button type="submit" class="btn btn-danger delete">Cancel rent</button>
				</form>
					`);

				sum.push(rentItem.cost);
			});

			let total = sum.reduce(function (a, b) {
				return a + b;
			});

			rentList.insertAdjacentHTML('afterbegin', `
		<strong>🤩 Your rent (Total: $${total})</strong>
		`);

			deleteRent();
		}
	}

	function deleteRent() {
		document.querySelectorAll('.unit-rent').forEach(unitRent => {
			unitRent.addEventListener('submit', function (event) {

				id = event.target.getAttribute('id');
				let unitEl = JSON.parse(localStorage.getItem(id));
				localStorage.removeItem(id);

				addAv({
					name: unitEl.name,
					type: unitEl.type,
					price: unitEl.price
				})

				deleteRentServer(id);
			});
		});
	}

	function deleteRentServer(id) {
		return fetch('http://localhost:5000/rent/' + id, {
			method: 'DELETE',
		})
	}
})();