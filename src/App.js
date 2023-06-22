import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { BsThreeDots } from 'react-icons/bs'

function App() {
  var uuid = require('uuid-v4')

  const [itemsFromBackend, setItemsFromBackend] = useState([
  ]);
  const columnsFromBackend = {
    [uuid()]: {
      name: "Requested",
      items: []
    },
    [uuid()]: {
      name: "To do",
      items: []
    },
    [uuid()]: {
      name: "In Progress",
      items: []
    },
    [uuid()]: {
      name: "Done",
      items: []
    }
  };

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

  const [columns, setColumns] = useState(columnsFromBackend);

  const [red, setRed] = useState(false);

  function addCard(event) {
    let item = { id: uuid(), content: "123" };
    itemsFromBackend.push(item);
    const column = columns[event.target.id];
    setColumns({
      ...columns,
      [event.target.id]: {
        ...column,
        items: [...column.items, item]
      }
    });
  }

  function changeText(event) {
    let itemIndex = itemsFromBackend.findIndex(obj => obj.id = event.currentTarget.id);
    let items = [...itemsFromBackend];
    items[itemIndex].content = event.currentTarget.textContent;
    setItemsFromBackend(items);
  }

  return (

    <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
      <DragDropContext
        onDragEnd={result => onDragEnd(result, columns, setColumns)}
      >
        {Object.entries(columns).map(([columnId, column]) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
              key={columnId}
            >
              <h2>{column.name}</h2>
              <div><button id={columnId} onClick={addCard}> Add new card</button></div>
              <div style={{
                margin: 8, display: "flex",
                flexDirection: 'row',
              }}

              >
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "lightblue"
                            : "lightgrey",
                          padding: 4,
                          width: 250,
                          minHeight: 500
                        }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      flex: 1,
                                      userSelect: "none",
                                      padding: 16,
                                      margin: "0 0 8px 0",
                                      minHeight: "50px",
                                      position: "relative",
                                      display: "flex",
                                      flexDirection: 'row',
                                      backgroundColor: snapshot.isDragging
                                        ? "#263B4A"
                                        : "#456C86",
                                      color: "white",
                                      ...provided.draggableProps.style
                                    }}
                                  >
                                    <BsThreeDots
                                      style={{
                                        position: "absolute", top: 0, right: "2%",
                                        backgroundColor: 'transparent',
                                        cursor: "default",
                                        color: "white",
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.color = "red";
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.color = "white";
                                      }}
                                      onClick={() => { console.log("hello") }}
                                    />
                                    <div
                                      id={item.id}
                                      style={{
                                        cursor: "auto", width: "fit-content",
                                        maxWidth: "100%"

                                      }}
                                      onFocus={(e) => { e.currentTarget.style.background = "red" }}
                                      onBlur={(e) => { e.currentTarget.style.background = "#456C86" }}
                                      onInput={changeText}
                                      contentEditable={true}
                                    >
                                      {item.content}
                                    </div>
                                    {

                                      <div style={{ display: "flex", flexDirection: 'column', position: "absolute", top: 20, right: -10, }}>
                                        <button>1234455</button>
                                        <button>12344555</button>
                                      </div>
                                    }

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
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
