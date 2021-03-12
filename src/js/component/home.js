import React, { useState, Fragment } from "react";

//create your first component
export function Home() {
	const DISPLAY_TASK_LIMIT = 4;

	const [task, setTask] = useState("");
	const [listTask, setListTask] = useState([]);
	const [itemSelected, setItemSelected] = useState("");

	/* CONTROLA EL EVENTO PARA INSERTAR TAREAS A LA LISTA */
	const handleOnKeyDown = e => {
		if (e.key === "Enter") {
			//code to execute here
			setListTask([
				...listTask,
				{ id: new Date().getTime(), task: task }
			]);
			setTask("");
		}
	};

	/* CONTROLA EL EVENTO PARA MOSTRAR EL BOTON DE ELIMINAR AL PASAR POR ENCIMA DE UN ITEM DE LISTA */
	const handleMouseOver = (e, id) => {
		if (itemSelected !== id) {
			setItemSelected(id);
		}
	};

	/* CONTROLA EL EVENTO PARA MOSTRAR EL BOTON DE ELIMINAR AL PASAR POR ENCIMA DE UN ITEM DE LISTA */
	const handleMouseOut = (e, id) => {
		setItemSelected("");
	};

	/* CONTROLA EL EVENTO DE ELIMINAR EL ITEM DE LA LISTA */
	const handleOnClick = (e, id) => {
		const list = [...listTask].filter(item => {
			return item.id !== id;
		});

		setListTask(list);
	};

	/* DECIDE SI EL BOTON DE ELIMINAR SE MUESTRA O NO */
	const itemObtenerClases = id => {
		let visible = "btn btn-outline-secondary float-right";
		let invisible = "btn btn-outline-secondary float-right invisible";

		if (itemSelected == id) {
			return visible;
		} else {
			return invisible;
		}
	};

	/* GENERA JSX LA LISTA DE MAX 4 ITEMS INICIALES */
	const generarLista = () => {
		let lista = [];
		if (listTask.length <= DISPLAY_TASK_LIMIT) {
			lista = [...listTask].reverse().map(item => {
				return generarItem(item);
			});
		} else {
			let displayLimitArray = [...listTask].reverse();
			displayLimitArray = displayLimitArray.slice(0, DISPLAY_TASK_LIMIT);
			lista = displayLimitArray.map(item => {
				return generarItem(item);
			});
		}

		return lista;
	};

	/* GENERA JSX DE UN ITEM DE LA LISTA */
	const generarItem = taskDetail => {
		return (
			<li
				id={"li" + taskDetail.id}
				key={taskDetail.id}
				className="list-group-item text-secondary"
				onMouseOver={e => {
					handleMouseOver(e, taskDetail.id);
				}}
				onMouseOut={e => {
					handleMouseOut(e, taskDetail.id);
				}}>
				<p className="d-inline-block ml-4">{taskDetail.task}</p>
				<button
					id={"btn" + taskDetail.id}
					className={itemObtenerClases(taskDetail.id)}
					onClick={e => handleOnClick(e, taskDetail.id)}>
					<i className="fas fa-times"></i>
				</button>
			</li>
		);
	};

	/* GENERA JSX INDICANDO SI HAY O NO ITEMS EN LA LISTA */
	const mostrarLista = () => {
		if (listTask.length == 0) {
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
			<input
				type="text"
				className="form-control mb-2 text-secondary"
				value={task}
				placeholder="Type your task"
				onChange={e => setTask(e.target.value)}
				onKeyDown={e => handleOnKeyDown(e)}
			/>
			{mostrarLista()}
		</div>
	);
}
