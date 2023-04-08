import React, { useCallback } from "react";
import { Table, Ref } from "semantic-ui-react";

function DynamicTableRowCells({ rowKey, refVariable, rows }) {
    const renderCell = useCallback((cellValue) => (<Table.Cell>{cellValue}</Table.Cell>), [])
    return (
        <Ref innerRef={refVariable} key={rowKey}>
            <Table.Row>
                {Object.values(rows).map(row => (renderCell(row)))}
            </Table.Row>
        </Ref>
    );
}

function memoize(component) {
    return React.memo(component, (prevProps, nextProps) => {
        return (
            prevProps.rowKey === nextProps.rowKey &&
            prevProps.refVariable === nextProps.refVariable &&
            JSON.stringify(prevProps.rows) === JSON.stringify(nextProps.rows)
        );
    });
}

export default memoize(DynamicTableRowCells);




