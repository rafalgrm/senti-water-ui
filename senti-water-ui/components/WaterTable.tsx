const {
    DataTable,
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
    Pagination,
} = require('@carbon/react');

const WaterTable = ({ rows, headers, handleOnRowClick, totalRows, onTableChange }: any) => {
    return (
        <div>
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
            <Pagination
                itemsPerPageText="Water bodies per page:"
                page={1}
                pageSize={10}
                pageSizes={[
                    10,
                    20,
                    50
                ]}
                totalItems={totalRows}
                onChange={(evt: { pageSize: number, page: number }) => onTableChange(evt)}
                size="md"
            />
        </div>
        
    )
}

export default WaterTable
