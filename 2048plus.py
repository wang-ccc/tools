#author Joshua 2024.10.8
import tkinter as tk
import numpy as np
import random

class Optimized2048Helper:
    def __init__(self, master, grid_size=4, max_depth=5):
        self.master = master
        self.master.title("2048 Assistant Tool - Optimized")
        self.grid_size = grid_size
        self.max_depth = max_depth
        self.board = np.zeros((self.grid_size, self.grid_size), dtype=int)
        
        # 数字映射：1 映射为 2，2 映射为 4，依此类推...
        self.value_map = {i: 2**i for i in range(1, 12)}
        
        self.init_ui()

    def init_ui(self):
        frame = tk.Frame(self.master)
        frame.grid()

        self.entry_labels = []
        for i in range(self.grid_size):
            row = []
            for j in range(self.grid_size):
                entry = tk.Entry(frame, width=4, font=('Arial', 18), justify='center')
                entry.grid(row=i, column=j, padx=5, pady=5)
                row.append(entry)
            self.entry_labels.append(row)

        # Button for computing best move
        compute_btn = tk.Button(self.master, text="Compute Best Move", command=self.compute_best_move)
        compute_btn.grid(row=1, column=0)

        # Button for showing move result
        move_btn = tk.Button(self.master, text="Show Move Result", command=self.show_move_result)
        move_btn.grid(row=1, column=1)

        # Label to show the best move
        self.best_move_label = tk.Label(self.master, text="Best Move: ")
        self.best_move_label.grid(row=2, column=0, columnspan=2)

        # Variable to store the best move
        self.best_move = None

    def get_board_from_input(self):
        for i in range(self.grid_size):
            for j in range(self.grid_size):
                value = self.entry_labels[i][j].get()
                if value.isdigit():
                    num = int(value)
                    # 使用映射：1 -> 2, 2 -> 4, ..., 11 -> 2048
                    self.board[i][j] = self.value_map.get(num, 0)  # 如果不是1到11，映射为0
                else:
                    self.board[i][j] = 0

    def compute_best_move(self):
        self.get_board_from_input()

        # Call the function to calculate best move
        self.best_move = self.find_best_move(self.board)

        self.best_move_label.config(text=f"Best Move: {self.best_move}")

    def show_move_result(self):
        self.get_board_from_input()
        
        if self.best_move is None:
            self.best_move_label.config(text="Compute best move first!")
            return
        
        new_board = self.move(self.board.copy(), self.best_move)

        # Update the UI to show the new board state
        for i in range(self.grid_size):
            for j in range(self.grid_size):
                if new_board[i][j] == 0:
                    self.entry_labels[i][j].delete(0, tk.END)
                else:
                    num_key = next(key for key, value in self.value_map.items() if value == new_board[i][j])
                    self.entry_labels[i][j].delete(0, tk.END)
                    self.entry_labels[i][j].insert(0, str(num_key))

    def get_possible_moves(self, board):
        moves = ['up', 'down', 'left', 'right']
        return [move for move in moves if not np.array_equal(board, self.move(board.copy(), move))]

    def move(self, board, direction):
        if direction == 'up':
            return self.move_up(board)
        elif direction == 'down':
            return self.move_down(board)
        elif direction == 'left':
            return self.move_left(board)
        elif direction == 'right':
            return self.move_right(board)

    def move_left(self, board):
        for i in range(self.grid_size):
            board[i] = self.merge_row(board[i])
        return board

    def move_right(self, board):
        for i in range(self.grid_size):
            board[i] = self.merge_row(board[i][::-1])[::-1]
        return board

    def move_up(self, board):
        return np.transpose(self.move_left(np.transpose(board)))

    def move_down(self, board):
        return np.transpose(self.move_right(np.transpose(board)))

    def merge_row(self, row):
        """ Helper function to merge a single row """
        new_row = [i for i in row if i != 0]
        for i in range(len(new_row) - 1):
            if new_row[i] == new_row[i + 1]:
                new_row[i] *= 2
                new_row[i + 1] = 0
        new_row = [i for i in new_row if i != 0]
        return new_row + [0] * (self.grid_size - len(new_row))

    def get_empty_cells(self, board):
        return [(i, j) for i in range(self.grid_size) for j in range(self.grid_size) if board[i][j] == 0]

    def evaluate_board(self, board):
        """ 综合评估棋盘状态，包括平滑度、单调性、空格数量等 """
        
        def smoothness(board):
            smoothness_score = 0
            for i in range(self.grid_size):
                for j in range(self.grid_size - 1):
                    if board[i][j] != 0 and board[i][j+1] != 0:
                        smoothness_score -= abs(board[i][j] - board[i][j+1])
            for i in range(self.grid_size - 1):
                for j in range(self.grid_size):
                    if board[i][j] != 0 and board[i+1][j] != 0:
                        smoothness_score -= abs(board[i][j] - board[i+1][j])
            return smoothness_score

        def monotonicity(board):
            total_score = 0
            for i in range(self.grid_size):
                row_score = 0
                for j in range(self.grid_size - 1):
                    if board[i][j] != 0 and board[i][j + 1] != 0:
                        if board[i][j] >= board[i][j + 1]:
                            row_score += board[i][j] - board[i][j + 1]
                        else:
                            row_score -= board[i][j + 1] - board[i][j]
                total_score += row_score
            
            for j in range(self.grid_size):
                col_score = 0
                for i in range(self.grid_size - 1):
                    if board[i][j] != 0 and board[i + 1][j] != 0:
                        if board[i][j] >= board[i + 1][j]:
                            col_score += board[i][j] - board[i + 1][j]
                        else:
                            col_score -= board[i + 1][j] - board[i][j]
                total_score += col_score
            return total_score

        def max_tile_position(board):
            max_tile = np.max(board)
            max_pos = np.argmax(board == max_tile)
            if max_pos in [0, self.grid_size - 1, self.grid_size * (self.grid_size - 1), self.grid_size * self.grid_size - 1]:
                return 1000  # 最大值在角落
            return 0  # 不在角落

        empty_cells = len(self.get_empty_cells(board))
        smooth_score = smoothness(board)
        mono_score = monotonicity(board)
        max_tile_pos_score = max_tile_position(board)

        # 综合多个评估标准
        return (smooth_score + mono_score + empty_cells * 200 + max_tile_pos_score)

    def minimax(self, board, depth, is_maximizing_player, alpha=float('-inf'), beta=float('inf')):
        if depth == 0:
            return self.evaluate_board(board)

        if is_maximizing_player:
            max_eval = float('-inf')
            for move in self.get_possible_moves(board):
                new_board = self.move(board.copy(), move)
                eval = self.minimax(new_board, depth - 1, False, alpha, beta)
                max_eval = max(max_eval, eval)
                alpha = max(alpha, eval)
                if beta <= alpha:
                    break  # Beta剪枝
            return max_eval
        else:
            min_eval = float('inf')
            empty_cells = self.get_empty_cells(board)
            for (i, j) in empty_cells:
                new_board = board.copy()
                new_board[i][j] = 2
                eval = self.minimax(new_board, depth - 1, True, alpha, beta)
                min_eval = min(min_eval, eval)
                beta = min(beta, eval)
                if beta <= alpha:
                    break  # Alpha剪枝
            return min_eval

    def find_best_move(self, board):
        best_score = float('-inf')
        best_move = None
        for move in self.get_possible_moves(board):
            new_board = self.move(board.copy(), move)
            score = self.minimax(new_board, self.max_depth - 1, False)
            if score > best_score:
                best_score = score
                best_move = move
        return best_move


# 启动图形化界面
root = tk.Tk()
game_helper = Optimized2048Helper(root)
root.mainloop()
