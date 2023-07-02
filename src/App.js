import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import './App.css'

function App() {
  var uuid = require('uuid-v4')
  const [cards, setCards] = useState([]);
  const [columns, setColumns] = useState({});
  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems
        }
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems
        }
      });
    }
  };
  function addCard(event) {
    let item = { id: uuid(), content: "" };
    cards.push(item);
    const column = columns[event.target.id];
    setColumns({
      ...columns,
      [event.target.id]: {
        ...column,
        items: [item, ...column.items]
      }
    });
  }
  function changeText(event) {
    event.preventDefault();
    let itemIndex = cards.findIndex(obj => obj.id === event.currentTarget.id);
    cards[itemIndex].content = event.currentTarget.value;
    event.currentTarget.style.height = "auto";
    event.currentTarget.style.height = `${event.currentTarget.scrollHeight}px`;
  }

  function deleteCard(cardId, columnId) {
    const itemIndex = cards.findIndex(obj => obj.id === cardId);
    cards.splice(itemIndex, 1);
    const column = columns[columnId];
    const columnItemIndex = column.items.findIndex(obj => obj.id === cardId);
    column.items.splice(columnItemIndex, 1);
    setColumns({
      ...columns,
      [columnId]: {
        ...column,
        items: [...column.items]
      }
    });
  }
  function changeTitle(event) {
    let column = columns[event.currentTarget.id];
    column.name = event.currentTarget.textContent;
  }
  function addColumn() {
    console.log(columns)
    let newColumn = {
      name: "New Column",
      items: []
    }
    columns[uuid()] = newColumn;
    setColumns({ ...columns });
  }
  function deleteColumn(event) {
    let itemsFromColumn = columns[event.currentTarget.id];
    let items = [...cards];
    let newItems = items.filter((val) => !itemsFromColumn.items.includes(val));
    setCards(newItems);
    delete columns[event.currentTarget.id];
  }
  function tryFinishInput(event) {
    if (event.key !== 'Enter') {
      return;
    }
    if ((!event.shiftKey && event.key === 'Enter')) {
      event.preventDefault();
      event.target.blur();
      return;
    }
  }
  const blurAll = () => {
    const elements = document.querySelectorAll('.focusElement');
    elements.forEach((element) => {
      element.blur();
    });
    const textArea = document.querySelector(".cardText");
    if (textArea.readOnly) {
      return;
    }
    const editButton = document.querySelector('.editCardButton');
    editButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  };

  return (
    <div className="wrapper"
    >
      <div className="columns">
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column]) => {
            return (
              <div
                className="column"
                key={columnId}
              >
                <div
                  className="columnTitle focusElement"
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  id={columnId}
                  onInput={changeTitle}
                  onKeyDown={(event) => tryFinishInput(event)}
                >
                  {column.name}
                </div>
                <div className="buttons">
                  <button
                    id={columnId}
                    onClick={addCard}
                    className="button"
                  >
                    Add new card
                  </button>
                  <button
                    id={columnId}
                    onClick={deleteColumn}
                    className="button">
                    Delete column
                  </button>
                </div>
                <div
                  className="columnDataContainer"
                >
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="columnData"
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  const textAreaRef = React.createRef();
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="card"
                                      style={{
                                        ...provided.draggableProps.style,
                                      }}
                                      onMouseDown={blurAll}
                                    >
                                      <textarea
                                        ref={textAreaRef}
                                        className="focusElement cardText"
                                        id={item.id}
                                        onChange={changeText}
                                        onKeyDown={(event) => tryFinishInput(event)}
                                        onMouseDown={(event) => event.stopPropagation()}
                                        placeholder="Type text here"
                                        readOnly
                                        style={
                                          {
                                            cursor: "grab",
                                            pointerEvents: 'none',
                                          }
                                        }
                                      />
                                      <div className="cardButtons">
                                        <AiFillDelete
                                          className="deleteCardButton"
                                          onClick={() => deleteCard(item.id, columnId)}
                                        />
                                        <AiFillEdit
                                          className="editCardButton"
                                          color='white'
                                          onMouseDown={(event) => {
                                            event.stopPropagation();
                                          }}
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            if (textAreaRef.current.readOnly) {
                                              event.currentTarget.style.color = "black"
                                              textAreaRef.current.readOnly = false;
                                              textAreaRef.current.style.pointerEvents = "auto";
                                              textAreaRef.current.style.cursor = "auto";
                                              textAreaRef.current.style.border = "3px rgb(9, 172, 227) solid"
                                            }
                                            else {
                                              event.currentTarget.style.color = "white"
                                              textAreaRef.current.readOnly = true;
                                              textAreaRef.current.style.pointerEvents = "none";
                                              textAreaRef.current.style.cursor = "grab";
                                              textAreaRef.current.style.border = "none"
                                            }
                                          }}
                                        />
                                      </div>
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              </div >
            );
          })}
        </DragDropContext >
      </div >
      <div className="addColumnButtonContainer" >
        <button className="addColumnButton button" onClick={addColumn}>Add column</button>
      </div>
    </div >
  );
}

export default App;