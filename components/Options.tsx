import styled from 'styled-components'
import SearchBar from './SearchBar'
import Footer from './Footer'
import { Draggable, Droppable } from 'react-beautiful-dnd'
import { useAppSelector } from 'redux/store'
import { useState } from 'react'
import { selectSelector } from 'redux/slice'

interface IOptions {
  type: 'available' | 'selected'
}

interface CssProps {
  checkedColor: boolean
  id: any
  selectedId: any
}

const Options = ({ type }: IOptions) => {
  const { option } = useAppSelector(selectSelector)
  const dataList = useAppSelector((state) => state.selector.items[type])
  const [checkedId, setCheckedId]: any = useState([1])
  const [checkedColor, setCheckedColor] = useState(false)
  const filterId = dataList.filter((item) => checkedId.includes(item.id))
  const selectedId = filterId.map((item) => item.id)

  //@ fileBlock logic
  type MoveDirCase = 'up' | 'down' | null

  const [lastClickedIdx, setLastClickedIdx] = useState<number | null>(null)
  const [clickedList, setClickedList] = useState<number[]>([])
  const [shiftMoveDir, setShiftMoveDir] = useState<MoveDirCase>(null)

  console.log(lastClickedIdx, clickedList, shiftMoveDir)

  const checkShiftMoveDir = (lastClicked: number, clickedIdx: number) => {
    let moveDir: MoveDirCase = null
    if (clickedIdx - lastClicked > 0) {
      moveDir = 'down'
    }

    if (clickedIdx - lastClicked < 0) {
      moveDir = 'up'
    }

    return moveDir
  }

  const onHandleBlock = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    if (event.ctrlKey || event.metaKey) {
      const existCheck = clickedList.findIndex((clicked) => clicked === index)

      if (existCheck !== -1) {
        const filteredList = clickedList.filter((clicked) => clicked !== index)
        setLastClickedIdx(filteredList[filteredList.length - 1])
        setClickedList(filteredList)
      } else {
        const newList = [...clickedList]
        newList.push(index)
        newList.sort((a, b) => a - b)
        setClickedList(newList)
        setLastClickedIdx(index)
      }

      //do not do code below
      return
    }

    if (event.shiftKey) {
      //when first shift => click all
      if (!clickedList.length) {
        const newList = Array(index + 1)
          .fill(null)
          .map((_, i) => i)
        setClickedList(newList)
        setLastClickedIdx(0)
        return
      }

      //if click the same last clicked index
      if (lastClickedIdx === index) {
        setClickedList([index])
        return
      }

      // common shift click case
      const max = Math.max(lastClickedIdx as number, index)
      const min = Math.min(lastClickedIdx as number, index)

      const newList = Array(max - min + 1)
        .fill(null)
        .map((_, i) => min + i)

      if (!shiftMoveDir) {
        const set = Array.from(new Set([...clickedList, ...newList]))
        const moveDir = checkShiftMoveDir(lastClickedIdx as number, index)

        setClickedList(set)
        setShiftMoveDir(moveDir)

        return
      }

      if (shiftMoveDir) {
        const set = Array.from(new Set([...clickedList, ...newList]))
        const moveDir = checkShiftMoveDir(lastClickedIdx as number, index)

        if (moveDir === shiftMoveDir) {
          setClickedList(set)
        } else {
          setClickedList(newList)
          setShiftMoveDir(moveDir)
        }
      }

      //do not do code below
      return
    }

    //single click
    setClickedList([index])
    setLastClickedIdx(index)
  }
  console.log(clickedList, lastClickedIdx)

  return (
    <ListWrapper>
      {option.search && <SearchBar />}
      <AvailableWrapper width={option.width} height={option.height}>
        <Availabletype>
          {type === 'available' ? option.titles[0] : option.titles[1]}
        </Availabletype>
        <Droppable droppableId={type}>
          {(provided) => (
            <ListBox {...provided.droppableProps} ref={provided.innerRef}>
              {dataList.map((el, index) => {
                return (
                  <Draggable
                    key={el.id}
                    draggableId={String(el.id)}
                    index={index}
                  >
                    {(provided) => (
                      <SingleList
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        onClick={(event) => onHandleBlock(event, index)}
                        checkedColor={checkedColor}
                        id={el.id}
                        selectedId={selectedId}
                        className={
                          clickedList.findIndex(
                            (clicked) => clicked === index
                          ) !== -1
                            ? 'highlight'
                            : ''
                        }
                      >
                        <ListContent className={`${option.itemSize}`}>
                          <span>{el.emoji}</span>
                          <span>{el.name}</span>
                        </ListContent>
                      </SingleList>
                    )}
                  </Draggable>
                )
              })}
              {provided.placeholder}
            </ListBox>
          )}
        </Droppable>
      </AvailableWrapper>

      {option.selectedItems && (
        <Footer total={dataList.length} selectedCount={selectedId.length} />
      )}
    </ListWrapper>
  )
}

const ListWrapper = styled.div``

const AvailableWrapper = styled.div<{ width: number; height: number }>`
  box-shadow: rgba(70, 53, 53, 0.25) 0px 0.0625em 0.0625em,
    rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em,
    rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset;
  border-radius: 15px;

  min-width: 25rem;
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  overflow: scroll;
  margin-bottom: 2rem;
`

const Availabletype = styled.div`
  font-size: 3.5rem;
  font-weight: 700;
  font-family: 'Ubuntu', sans-serif;
  padding: 1.5rem 3.4rem;
  border-bottom: 1px solid lightgray;
`

const ListBox = styled.div`
  min-height: 100%;
`

const SingleList = styled.div<CssProps>`
  display: flex;
  flex-direction: row;
  font-size: 2.5rem;
  border-bottom: 1px solid lightgray;
  /* margin-top: 0.1rem; */

  display: flex;
  text-decoration: none;
  color: inherit;
  position: relative;
  padding: 2.5rem 0 2rem 3.5rem;
  background-color: #fff;
  cursor: pointer;

  &:before {
    position: absolute;
    left: 0;
    bottom: 0;
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    background: rgb(255, 201, 71);
    background: linear-gradient(
      90deg,
      rgba(255, 201, 71, 1) 0%,
      rgba(255, 125, 74, 1) 50%,
      rgba(254, 69, 77, 1) 100%
    );
    transform-origin: 0 bottom 0;
    transform: scaleY(0);
    transition: 0.2s ease-out;
    ${({ selectedId, id }) => {
      return selectedId.includes(id)
        ? 'transform: scaleY(1)'
        : 'transform: scaleY(0)'
    }}
  }

  &.highlight {
    &:before {
      transform: scaleY(1);
    }
  }

  &:hover {
    div {
      color: #fff;
    }
    &:before {
      transform: scaleY(1);
    }
  }

  div {
    position: relative;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.333;
    transition: 0.2s ease-out;
  }
`

const ListContent = styled.div`
  & span:first-child {
    margin-right: 1.5rem;
  }

  &.XS span {
    font-size: 1.5rem;
  }

  &.S span {
    font-size: 2rem;
  }

  &.M span {
    font-size: 2.5rem;
  }
`

export default Options
