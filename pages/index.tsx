import type { NextPage } from 'next'

import styled from 'styled-components'
import Options from 'components/Options'
import Buttons from 'components/Buttons'
import Header from 'components/Header'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { useAppDispatch } from 'redux/store'
import { dragAndDrop } from 'redux/slice'

const Home: NextPage = () => {
  const dispatch = useAppDispatch()

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return
    }

    const draggingItemIndex = result.source.index
    const dropItemIndex = result.destination.index

    dispatch(
      dragAndDrop({
        items: result.source.droppableId as 'available' | 'selected',
        from: {
          type: result.source.droppableId as 'available' | 'selected',
          index: draggingItemIndex,
        },
        to: {
          type: result.destination.droppableId as 'available' | 'selected',
          index: dropItemIndex,
        },
      })
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Header />
      <Wrapper>
        <Main>
          <Options type={'available'} />
          <Buttons />
          <Options type={'selected'} />
        </Main>
      </Wrapper>
    </DragDropContext>
  )
}

const Wrapper = styled.div`
  width: 100vw;
  display: flex;
  justify-content: center;
`

const Main = styled.main`
  display: flex;
  justify-content: center;
  min-width: 120rem;
  max-width: 120rem;
  height: 100%;
  /* min-height: 100vh; */
  margin: 0;
  position: relative;
`

export default Home
