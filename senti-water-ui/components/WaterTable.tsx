const {
    DataTable,
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
  } = require('@carbon/react');

const WaterTable = ({ rows, headers, handleOnRowClick }: any) => {
    return (
        <DataTable rows={rows} headers={headers}>
            {({ rows, headers, getTableProps, getHeaderProps, getRowProps }: any) => (
                <Table {...getTableProps()}>
                <TableHead>
                    <TableRow>
                    {headers.map((header: any) => (
                        <TableHeader key={header.key} {...getHeaderProps({ header })}>
                            {header.header}
                        </TableHeader>
                    ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row: any) => (
                    <TableRow key={row.id} {...getRowProps({ row })} onClick={handleOnRowClick}>
                        {row.cells.map((cell: any) => (
                            <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            )}
        </DataTable>
    )
}

export default WaterTable
