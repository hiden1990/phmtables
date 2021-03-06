import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { useMedia } from 'use-media'
import { useTable, useSortBy, useExpanded } from 'react-table'

import { LoaderPHM } from '../../components/Loader'
import { getData } from '../../api/get-data'
import { RESULT_URL } from '../../api/data-url'
import {
  TableStyles,
  TrOver,
  Tr,
  TrUnder,
  ScoreWrapper,
  ScoreLink,
  Score,
  LogoWrapper,
  Team,
  TeamHome,
  TeamLogo,
  TeamName,
  TeamNameHome,
  PhotoLink,
  Info,
  InfoDetails,
  InfoMobile,
  InfoMobileBottom,
  AllFilters,
} from './styled'
import { Filters } from './Filters'

import { TiStopwatch, TiCameraOutline } from 'react-icons/ti'
import { GiWhistle } from 'react-icons/gi'

const Table = ({ columns, data, renderRowUnder, renderRowOver }) => {
  const {
    getTableProps,
    getTableBodyProps,
    rows,
    prepareRow,
    flatColumns,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
    useExpanded
  )

  const min630 = useMedia({ minWidth: '630px' })

  return (
    <table {...getTableProps()}>
      <tbody {...getTableBodyProps()}>
        {rows.map(row => {
          prepareRow(row)
          return (
            <React.Fragment key={row.index}>
              {!min630 && (
                <TrOver>
                  <td colSpan={flatColumns.length}>{renderRowOver({ row })}</td>
                </TrOver>
              )}
              <Tr borders={min630} {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </Tr>
              {!min630 && (
                <TrUnder>
                  <td colSpan={flatColumns.length}>
                    {renderRowUnder({ row })}
                  </td>
                </TrUnder>
              )}
            </React.Fragment>
          )
        })}
      </tbody>
    </table>
  )
}

const Result = () => {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getData(RESULT_URL, (data, tabletop) => {
      const newData = data['Matches4publish'].elements
        .slice(0)
        .filter(item => item['Game ID'] !== '')
      setData(newData)
      setFilteredData(newData)
      setIsLoading(false)
    })
  }, [])

  const min630 = useMedia({ minWidth: '630px' })
  const min980 = useMedia({ minWidth: '980px' })

  const columns = useMemo(
    () => [
      {
        accessor: 'Datum a Místo',
        show: min630,
        Cell: data => {
          const detailsValue = data.data[data.row.index]['Detaily zápasu']
            .split(',')
            .join(', ')
          const cellData = data.cell.value.split(',')
          return (
            <>
              <Info>{`${cellData[0]} ${cellData[1]}`}</Info>
              <Info>
                <strong>{`${cellData[2]} ${cellData[3]}`}</strong>
              </Info>
              <InfoDetails>{detailsValue}</InfoDetails>
            </>
          )
        },
      },
      {
        accessor: 'Tým (domácí)',
        Cell: data => {
          return (
            <TeamHome>
              <LogoWrapper>
                <TeamLogo src={data.cell.value} alt={data[data.row.index]} />
              </LogoWrapper>
              <TeamNameHome>{data.row.original['Tým 1 název']}</TeamNameHome>
            </TeamHome>
          )
        },
      },
      {
        accessor: 'Skóre',
        Cell: data => {
          const photoLink = data.data[data.row.index]['Fotoalbum']

          return (
            <>
              <ScoreWrapper>
                <ScoreLink
                  href={data.cell.row.original['Reportáž']}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Score>{data.cell.value}</Score>
                </ScoreLink>
              </ScoreWrapper>
              {photoLink !== '' && photoLink !== 'Missing' && !min630 && (
                <PhotoLink
                  href={photoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TiCameraOutline
                    style={{
                      display: 'block',
                      margin: '0 auto',
                      fontSize: '4rem',
                    }}
                  />
                </PhotoLink>
              )}
            </>
          )
        },
      },
      {
        accessor: 'Tým (hosté)',
        Cell: data => {
          return (
            <Team>
              <LogoWrapper>
                <TeamLogo src={data.cell.value} alt={data[data.row.index]} />
              </LogoWrapper>
              <TeamName>{data.row.original['Tým 2 název']}</TeamName>
            </Team>
          )
        },
      },
      {
        accessor: 'Časoměřič',
        show: min980,
        Cell: data => {
          return (
            <>
              <p>
                <TiStopwatch />
                {data.cell.value}
              </p>
              <p>
                <GiWhistle />
                {data.row.original['Rozhodčí']}
              </p>
            </>
          )
        },
      },
      {
        accessor: 'Fotoalbum',
        show: min630,
        Cell: data => {
          return (
            data.cell.value !== '' &&
            data.cell.value !== 'Missing' && (
              <PhotoLink
                href={data.cell.value}
                target="_blank"
                rel="noopener noreferrer"
              >
                <TiCameraOutline style={{ fontSize: '4rem' }} />
              </PhotoLink>
            )
          )
        },
      },
    ],
    [min630, min980]
  )

  const renderRowOver = useCallback(
    ({ row }) => <InfoMobile>{row.values['Datum a Místo']}</InfoMobile>,
    []
  )

  const renderRowUnder = useCallback(
    ({ row }) => (
      <InfoMobileBottom>
        {row.original['Detaily zápasu'].split(',').join(', ')}
      </InfoMobileBottom>
    ),
    []
  )

  return isLoading ? (
    <LoaderPHM />
  ) : (
    <>
      <Filters data={data} setFilteredData={setFilteredData} />
      <AllFilters>
        <TableStyles>
          <Table
            columns={columns}
            data={filteredData}
            renderRowUnder={renderRowUnder}
            renderRowOver={renderRowOver}
          />
        </TableStyles>
      </AllFilters>
    </>
  )
}

export { Result }
