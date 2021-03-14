import React, { useState, Fragment, useEffect } from "react";

//create your first component
export function Home() {
	const DISPLAY_TASK_LIMIT = 4;
	const API_URL = "https://assets.breatheco.de/apis/fake/todos/user/juan";
	const CONTENT_TYPE = "application/json";
	const POST = "POST";
	const GET = "GET";
	const PUT = "PUT";
	const DELETE = "DELETE";

	const [task, setTask] = useState("");
	const [listTask, setListTask] = useState([]);
	const [itemSelected, setItemSelected] = useState(-1);
	const [habilitarInput, setHabilitarInput] = useState(false);

	useEffect(() => {
		obtenerTareas();
	}, []);

	const crearListaTareas = async () => {
		var myHeaders = new Headers();
		myHeaders.append("Content-Type", CONTENT_TYPE);

		var raw = JSON.stringify([]);

		var requestOptions = {
			method: POST,
			headers: myHeaders,
			body: raw
		};

		const response = await fetch(API_URL, requestOptions)
			.then(response => response.text())
			.then(result => {})
			.catch(error => console.log("error", error));
	};

	const obtenerTareas = () => {
		var myHeaders = new Headers();
		myHeaders.append("Content-Type", CONTENT_TYPE);

		var requestOptions = {
			method: GET,
			headers: myHeaders
		};

		const response = fetch(API_URL, requestOptions)
			.then(response => {
				if (response.ok) {
					return response.json();
				}

				if (response.status === 404) {
					return [];
				}

				throw Error("Task list does not exits");
			})
			.then(result => {
				setHabilitarInput(true);
				setListTask(result);
			})
			.catch(error => {
				//console.log(error.status);
				//console.log(error);
				setListTask([]);
				console.log(error);
			});
	};

	const actualizarTareas = lista => {
		var myHeaders = new Headers();
		myHeaders.append("Content-Type", CONTENT_TYPE);

		var raw = JSON.stringify(lista);

		var requestOptions = {
			method: PUT,
			headers: myHeaders,
			body: raw
		};

		fetch(API_URL, requestOptions)
			.then(response => response.json())
			.then(result => {})
			.catch(error => console.log("error", error));
	};

	const eliminarListaTareas = () => {
		var myHeaders = new Headers();
		myHeaders.append("Content-Type", CONTENT_TYPE);

		var requestOptions = {
			method: DELETE,
			headers: myHeaders
		};

		fetch(API_URL, requestOptions)
			.then(response => response.json())
			.then(result => {
				setListTask([]);
			})
			.catch(error => console.log("error", error));
	};

	/* CONTROLA EL EVENTO PARA INSERTAR TAREAS A LA LISTA */
	const handleOnKeyDown = async e => {
		if (e.key === "Enter") {
			const lista = [...listTask, { done: false, label: task }];
			//code to execute here
			if (listTask.length === 0) {
				await crearListaTareas();
			}
			setListTask(lista);
			setTask("");
			actualizarTareas(lista);
		}
	};

	/* CONTROLA EL EVENTO PARA MOSTRAR EL BOTON DE ELIMINAR AL PASAR POR ENCIMA DE UN ITEM DE LISTA */
	const handleMouseOver = (e, index) => {
		if (itemSelected !== index) {
			setItemSelected(index);
		}
	};

	/* CONTROLA EL EVENTO PARA MOSTRAR EL BOTON DE ELIMINAR AL PASAR POR ENCIMA DE UN ITEM DE LISTA */
	const handleMouseOut = e => {
		setItemSelected(-1);
	};

	/* CONTROLA EL EVENTO DE ELIMINAR EL ITEM DE LA LISTA */
	const handleOnClick = (e, index) => {
		let list = [];
		for (let i = 0; i < listTask.length; i++) {
			if (i !== index) {
				list.push(listTask[i]);
			}
		}
		setListTask(list);
		if (list.length > 0) {
			actualizarTareas(list);
		} else {
			eliminarListaTareas();
		}
	};

	const handleClear = e => {
		eliminarListaTareas();
	};

	/* DECIDE SI EL BOTON DE ELIMINAR SE MUESTRA O NO */
	const itemObtenerClases = index => {
		let visible = "btn btn-outline-secondary float-right";
		let invisible = "btn btn-outline-secondary float-right invisible";

		if (itemSelected === index) {
			return visible;
		} else {
			return invisible;
		}
	};

	/* GENERA JSX LA LISTA DE MAX 4 ITEMS INICIALES */
	const generarLista = () => {
		let lista = [];
		if (listTask.length <= DISPLAY_TASK_LIMIT) {
			lista = [...listTask].map((item, index) => {
				return generarItem(item, index);
			});
		} else {
			let displayLimitArray = [...listTask];
			displayLimitArray = displayLimitArray.slice(0, DISPLAY_TASK_LIMIT);
			lista = displayLimitArray.map((item, index) => {
				return generarItem(item, index);
			});
		}

		return lista;
	};

	/* GENERA JSX DE UN ITEM DE LA LISTA */
	const generarItem = (taskDetail, index) => {
		return (
			<li
				id={"li" + index}
				key={index}
				className="list-group-item text-secondary"
				onMouseOver={e => {
					handleMouseOver(e, index);
				}}
				onMouseOut={e => {
					handleMouseOut(e);
				}}>
				<p className="d-inline-block ml-4">{taskDetail.label}</p>
				<button
					id={"btn" + index}
					className={itemObtenerClases(index)}
					onClick={e => handleOnClick(e, index)}>
					<i className="fas fa-times"></i>
				</button>
			</li>
		);
	};

	/* GENERA JSX INDICANDO SI HAY O NO ITEMS EN LA LISTA */
	const mostrarLista = () => {
		if (habilitarInput && listTask.length == 0) {
			return <h5 className="text-muted ml-2">No tasks, add a task</h5>;
		} else {
			return (
				<Fragment>
					<ul className="list-group">{generarLista()}</ul>
					{showItemsLeft()}
				</Fragment>
			);
		}
	};

	const showItemsLeft = () => {
		if (listTask.length > DISPLAY_TASK_LIMIT) {
			return (
				<div className="card">
					<ul className="list-group list-group-flush">
						<li className="list-group-item text-secondary ml-4">
							{listTask.length - DISPLAY_TASK_LIMIT} items left
						</li>
					</ul>
				</div>
			);
		}

		return null;
	};

	return (
		<div className="container">
			<h1 className="text-muted text-center">todos</h1>

			<div className="input-group">
				<input
					type="text"
					className="form-control mb-2 text-secondary"
					value={task}
					placeholder={
						habilitarInput ? "Type your task" : "loading..."
					}
					onChange={e => setTask(e.target.value)}
					onKeyDown={e => handleOnKeyDown(e)}
					aria-describedby="btnClear"
					disabled={habilitarInput ? "" : "disabled"}
				/>
				<div className="input-group-append">
					<button
						className="btn btn-outline-secondary"
						type="button"
						id="btnClear"
						onClick={e => handleClear(e)}>
						Clear
					</button>
				</div>
			</div>
			{mostrarLista()}
		</div>
	);
}
