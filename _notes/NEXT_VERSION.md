# NEXT VERSION

The next version should:

## immediately render some text to the terminal: 

This text should include:

- title
- files
- timer

```bash
REGINALD   |   0 / 12   |   0.00s 
```

## render an array of filenames that were accumulated:

This list should update in place

```bash
REGINALD   |   0 / 12   |   8.60s 

 - | full/file/path         | 5 / 5      | 1.2s
 X | full/file/path         | 3 / 5      | 0.8s
 - | full/file/path         | 5 / 5      | 3.1s
 - | full/file/path         | 5 / 5      | 2.5s
   | full/file/path
   | full/file/path
```

## Render readable results in the terminal:

```bash
REGINALD   |   0 / 12   |   8.60s 

 - | full/file/path         | 5 / 5      | 1.2s
 X | full/file/path         | 3 / 5      | 0.8s
 - | full/file/path         | 7 / 7      | 3.1s
 - | full/file/path         | 3 / 3      | 2.5s
 - | full/file/path         | 3 / 3      | 1.3s
 - | full/file/path         | 4 / 4      | 1.7s

25 / 27 
```
